package main

import (
    "bytes"
    "flag"
    "fmt"
    "html/template"
    "io"
    "net/http"
    "net/url"
    "os"
    "path/filepath"
    "sort"
    "strings"
    "time"

    "github.com/fxamacker/cbor/v2"
    "github.com/goccy/go-json"
    "github.com/klauspost/compress/gzip"
    "github.com/klauspost/compress/zstd"
)

type snapshot struct {
    Commit  string `json:"commit"`
    Version string `json:"version,omitempty"`
}

type binaryEntry struct {
    Rank        uint16     `json:"rank,omitempty"`
    Name        string     `json:"pkg"`
    PrettyName  string     `json:"pkg_name"`
    PkgId       string     `json:"pkg_id"`
    Description string     `json:"description,omitempty"`
    Version     string     `json:"version,omitempty"`
    DownloadURL string     `json:"download_url,omitempty"`
    Icon        string     `json:"icon,omitempty"`
    Size        string     `json:"size,omitempty"`
    Bsum        string     `json:"bsum,omitempty"`
    Shasum      string     `json:"shasum,omitempty"`
    BuildDate   string     `json:"build_date,omitempty"`
    BuildScript string     `json:"build_script,omitempty"`
    BuildLog    string     `json:"build_log,omitempty"`
    Categories  string     `json:"categories,omitempty"`
    ExtraBins   string     `json:"provides,omitempty"`
    Screenshots []string   `json:"screenshots,omitempty"`
    License     []string   `json:"license,omitempty"`
    Snapshots   []snapshot `json:"snapshots,omitempty"`
    Notes       []string   `json:"notes,omitempty"`
    SrcURLs     []string   `json:"src_urls,omitempty"`
    WebURLs     []string   `json:"web_urls,omitempty"`
    RepoURL     string     `json:"-"`
    RepoGroup   string     `json:"-"`
    RepoName    string     `json:"-"`
}

type Config struct {
    RepoURLs     []string
    CacheDir     string
    NoConfig     bool
    OutputDir    string
    TemplatesDir string
}

type RepoGroup struct {
    Name    string
    Tag     string
    Repos   []Repo
    Default bool
}

type Repo struct {
    Name  string
    URL   string
    Group string
}

func fetchMetadata(url string) (io.ReadCloser, error) {
    resp, err := http.Get(url)
    if err != nil {
        return nil, fmt.Errorf("error fetching metadata from %s: %v", url, err)
    }
    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("error fetching metadata from %s: %s", url, resp.Status)
    }
    return resp.Body, nil
}

func decodeRepoIndex(config *Config) ([]binaryEntry, error) {
    var binaryEntries []binaryEntry
    repoGroups := make(map[string]*RepoGroup)

    for _, repoURL := range config.RepoURLs {
        if repoURL == "" {
            return nil, fmt.Errorf("repository index URL is empty. Please check your configuration or remove it")
        }

        var bodyReader io.ReadCloser
        var err error

        if strings.HasPrefix(repoURL, "file://") {
            filePath := strings.TrimPrefix(repoURL, "file://")
            bodyReader, err = os.Open(filePath)
            if err != nil {
                return nil, fmt.Errorf("error opening file %s: %v", filePath, err)
            }
            defer bodyReader.Close()
        } else {
            if config.NoConfig {
                bodyReader, err = fetchMetadata(repoURL)
                if err != nil {
                    return nil, err
                }
            } else {
                cachedFilePath := filepath.Join(config.CacheDir, "."+filepath.Base(repoURL))

                if err := os.MkdirAll(config.CacheDir, 0755); err != nil {
                    return nil, fmt.Errorf("error creating cache directory %s: %v", config.CacheDir, err)
                }

                fileInfo, err := os.Stat(cachedFilePath)
                if err == nil && time.Since(fileInfo.ModTime()).Hours() < 6 {
                    bodyReader, err = os.Open(cachedFilePath)
                    if err != nil {
                        return nil, fmt.Errorf("error opening cached file %s: %v", cachedFilePath, err)
                    }
                    defer bodyReader.Close()
                } else {
                    bodyReader, err = fetchMetadata(repoURL)
                    if err != nil {
                        return nil, err
                    }
                    defer bodyReader.Close()

                    cachedFile, err := os.Create(cachedFilePath)
                    if err != nil {
                        return nil, fmt.Errorf("error creating cached file %s: %v", cachedFilePath, err)
                    }
                    defer cachedFile.Close()

                    _, err = io.Copy(cachedFile, bodyReader)
                    if err != nil {
                        return nil, fmt.Errorf("error writing to cached file %s: %v", cachedFilePath, err)
                    }

                    bodyReader, err = os.Open(cachedFilePath)
                    if err != nil {
                        return nil, fmt.Errorf("error opening cached file %s: %v", cachedFilePath, err)
                    }
                    defer bodyReader.Close()
                }
            }
        }

        processedURL := repoURL
        if strings.HasSuffix(repoURL, ".gz") {
            processedURL = strings.TrimSuffix(repoURL, ".gz")
            bodyReader, err = gzip.NewReader(bodyReader)
            if err != nil {
                return nil, fmt.Errorf("error creating gzip reader for %s: %v", repoURL, err)
            }
            defer bodyReader.Close()
        }
        if strings.HasSuffix(repoURL, ".zst") {
            processedURL = strings.TrimSuffix(repoURL, ".zst")
            zstdReader, err := zstd.NewReader(bodyReader)
            if err != nil {
                return nil, fmt.Errorf("error creating zstd reader for %s: %v", repoURL, err)
            }
            defer zstdReader.Close()
            bodyReader = zstdReader.IOReadCloser()
        }

        body := new(bytes.Buffer)
        if _, err := io.Copy(body, bodyReader); err != nil {
            return nil, fmt.Errorf("error reading from %s: %v", repoURL, err)
        }

        var repoIndex map[string][]binaryEntry
        switch {
        case strings.HasSuffix(processedURL, ".cbor"):
            if err := cbor.Unmarshal(body.Bytes(), &repoIndex); err != nil {
                return nil, fmt.Errorf("error decoding CBOR from %s: %v", repoURL, err)
            }
        case strings.HasSuffix(processedURL, ".json"):
            if err := json.Unmarshal(body.Bytes(), &repoIndex); err != nil {
                return nil, fmt.Errorf("error decoding JSON from %s: %v", repoURL, err)
            }
        default:
            return nil, fmt.Errorf("unsupported format for URL: %s", repoURL)
        }

        repoGroup := "dbin (amd64)"
        if u, err := url.Parse(repoURL); err == nil {
            if label := u.Query().Get("label"); label != "" {
                repoGroup = label
            }
        }

        for repoName, entries := range repoIndex {
            for i := range entries {
                entries[i].RepoURL = repoURL
                entries[i].RepoGroup = repoGroup
                entries[i].RepoName = repoName
                binaryEntries = append(binaryEntries, entries[i])
            }

            if _, exists := repoGroups[repoGroup]; !exists {
                repoGroups[repoGroup] = &RepoGroup{
                    Name:    repoGroup,
                    Tag:     repoGroup,
                    Default: repoGroup == "dbin (amd64)",
                }
            }
            found := false
            for _, r := range repoGroups[repoGroup].Repos {
                if r.Name == repoName {
                    found = true
                    break
                }
            }
            if !found {
                repoGroups[repoGroup].Repos = append(repoGroups[repoGroup].Repos, Repo{
                    Name:  repoName,
                    URL:   repoURL,
                    Group: repoGroup,
                })
            }
        }
    }

    return binaryEntries, nil
}

func generateHTML(entries []binaryEntry, config *Config) error {
    if err := os.MkdirAll(config.OutputDir, 0755); err != nil {
        return fmt.Errorf("error creating output directory %s: %v", config.OutputDir, err)
    }

    entriesWithIcons := []binaryEntry{}
    for _, entry := range entries {
        if entry.Icon != "" {
            entriesWithIcons = append(entriesWithIcons, entry)
        }
    }

    funcMap := template.FuncMap{
        "splitCategories": func(categories string) []string {
            return strings.Split(categories, ",")
        },
        "inc": func(i int) int {
            return i + 1
        },
        "dec": func(i int) int {
            return i - 1
        },
        "encodeURI": func(s string) string {
            return url.QueryEscape(s)
        },
        "first": func(n int, list []binaryEntry) []binaryEntry {
            if n >= len(list) {
                return list
            }
            return list[:n]
        },
    }

    baseTmplData, err := os.ReadFile(filepath.Join(config.TemplatesDir, "base.tmpl"))
    if err != nil {
        return fmt.Errorf("error reading base template: %v", err)
    }

    indexTmplData, err := os.ReadFile(filepath.Join(config.TemplatesDir, "index.tmpl"))
    if err != nil {
        return fmt.Errorf("error reading index template: %v", err)
    }

    appTmplData, err := os.ReadFile(filepath.Join(config.TemplatesDir, "app.tmpl"))
    if err != nil {
        return fmt.Errorf("error reading app template: %v", err)
    }

    baseTmpl := template.Must(template.New("base").Funcs(funcMap).Parse(string(baseTmplData)))
    indexTmpl := template.Must(template.Must(baseTmpl.Clone()).Parse(string(indexTmplData)))
    appTmpl := template.Must(template.Must(baseTmpl.Clone()).Parse(string(appTmplData)))

    indexFile, err := os.Create(filepath.Join(config.OutputDir, "index.html"))
    if err != nil {
        return fmt.Errorf("error creating index.html: %v", err)
    }
    defer indexFile.Close()

    categoryMap := make(map[string]struct{})
    categoryEntries := make(map[string][]binaryEntry)
    seenApps := make(map[string]bool)
    for _, entry := range entriesWithIcons {
        if entry.Categories != "" {
            categories := strings.Split(entry.Categories, ",")
            for _, cat := range categories {
                trimmedCat := strings.TrimSpace(cat)
                if trimmedCat != "" {
                    categoryMap[trimmedCat] = struct{}{}
                    if !seenApps[entry.Name] {
                        categoryEntries[trimmedCat] = append(categoryEntries[trimmedCat], entry)
                        seenApps[entry.Name] = true
                        break
                    }
                }
            }
        }
    }

    categories := make([]struct{ Name string }, 0, len(categoryMap))
    for cat := range categoryMap {
        categories = append(categories, struct{ Name string }{cat})
    }
    sort.Slice(categories, func(i, j int) bool {
        return categories[i].Name < categories[j].Name
    })

    for cat := range categoryEntries {
        sortedEntries := categoryEntries[cat]
        sort.Slice(sortedEntries, func(i, j int) bool {
            return sortedEntries[i].Rank < sortedEntries[j].Rank
        })
        categoryEntries[cat] = sortedEntries
    }

    var topEntries []binaryEntry
    seenNames := make(map[string]bool)
    for _, entry := range entriesWithIcons {
        if len(topEntries) >= 9 {
            break
        }
        if !seenNames[entry.PrettyName] && len(entry.Screenshots) > 0 {
            topEntries = append(topEntries, entry)
            seenNames[entry.PrettyName] = true
        }
    }

    repoGroups := make(map[string]*RepoGroup)
    for _, entry := range entries {
        if _, exists := repoGroups[entry.RepoGroup]; !exists {
            repoGroups[entry.RepoGroup] = &RepoGroup{
                Name:    entry.RepoGroup,
                Tag:     entry.RepoGroup,
                Default: entry.RepoGroup == "dbin (amd64)",
            }
        }
        found := false
        for _, repo := range repoGroups[entry.RepoGroup].Repos {
            if repo.Name == entry.RepoName {
                found = true
                break
            }
        }
        if !found {
            repoGroups[entry.RepoGroup].Repos = append(repoGroups[entry.RepoGroup].Repos, Repo{
                Name:  entry.RepoName,
                URL:   entry.RepoURL,
                Group: entry.RepoGroup,
            })
        }
    }

    var repoGroupsSlice []RepoGroup
    for _, group := range repoGroups {
        repoGroupsSlice = append(repoGroupsSlice, *group)
    }

    entriesByName := make(map[string][]binaryEntry)
    for _, entry := range entries {
        entriesByName[entry.Name] = append(entriesByName[entry.Name], entry)
    }

    filteredEntries := []binaryEntry{}
    seenApps = make(map[string]bool)
    for _, entry := range entriesWithIcons {
        if !seenApps[entry.Name] {
            filteredEntries = append(filteredEntries, entry)
            seenApps[entry.Name] = true
        }
    }

    data := struct {
        TopEntries           []binaryEntry
        Categories           []struct{ Name string }
        CategoryEntries      map[string][]binaryEntry
        Entries              []binaryEntry
        RepoGroups           []RepoGroup
        CurrentRepoSelection string
    }{
        TopEntries:           topEntries,
        Categories:           categories,
        CategoryEntries:      categoryEntries,
        Entries:              filteredEntries,
        RepoGroups:           repoGroupsSlice,
        CurrentRepoSelection: "All",
    }

    if err := indexTmpl.Execute(indexFile, data); err != nil {
        return fmt.Errorf("error executing index template: %v", err)
    }

    for _, entry := range entriesWithIcons {
        appDir := filepath.Join(config.OutputDir, entry.RepoName, entry.Name, entry.PkgId)
        if err := os.MkdirAll(appDir, 0755); err != nil {
            return fmt.Errorf("error creating app directory %s: %v", appDir, err)
        }

        appFile, err := os.Create(filepath.Join(appDir, "index.html"))
        if err != nil {
            return fmt.Errorf("error creating app index.html: %v", err)
        }
        defer appFile.Close()

        entryWithAlternatives := struct {
            binaryEntry
            AlternativeVersions []binaryEntry
        }{
            binaryEntry: entry,
        }

        if versions, ok := entriesByName[entry.Name]; ok && len(versions) > 1 {
            for _, v := range versions {
                if v.PkgId != entry.PkgId {
                    entryWithAlternatives.AlternativeVersions = append(entryWithAlternatives.AlternativeVersions, v)
                }
            }
        }

        if err := appTmpl.Execute(appFile, entryWithAlternatives); err != nil {
            return fmt.Errorf("error executing app template: %v", err)
        }
    }

    for category := range categoryMap {
        categoryDir := filepath.Join(config.OutputDir, "categories", category)
        if err := os.MkdirAll(categoryDir, 0755); err != nil {
            return fmt.Errorf("error creating category directory %s: %v", categoryDir, err)
        }

        categoryFile, err := os.Create(filepath.Join(categoryDir, "index.html"))
        if err != nil {
            return fmt.Errorf("error creating category index.html: %v", err)
        }
        defer categoryFile.Close()

        var categoryEntriesAll []binaryEntry
        for _, entry := range entriesWithIcons {
            if strings.Contains(entry.Categories, category) {
                categoryEntriesAll = append(categoryEntriesAll, entry)
            }
        }

        sort.Slice(categoryEntriesAll, func(i, j int) bool {
            return categoryEntriesAll[i].Rank < categoryEntriesAll[j].Rank
        })

        data := struct {
            TopEntries           []binaryEntry
            Categories           []struct{ Name string }
            Entries              []binaryEntry
            CategoryEntries      map[string][]binaryEntry
            RepoGroups           []RepoGroup
            CurrentRepoSelection string
            CurrentCategory      string
        }{
            TopEntries:           topEntries,
            Categories:           categories,
            Entries:              categoryEntriesAll,
            CategoryEntries:      categoryEntries,
            RepoGroups:           repoGroupsSlice,
            CurrentRepoSelection: "All",
            CurrentCategory:      category,
        }

        if err := indexTmpl.Execute(categoryFile, data); err != nil {
            return fmt.Errorf("error executing category template: %v", err)
        }
    }

    for _, repoGroup := range repoGroupsSlice {
        for _, repo := range repoGroup.Repos {
            repoDir := filepath.Join(config.OutputDir, repo.Name)
            if err := os.MkdirAll(repoDir, 0755); err != nil {
                return fmt.Errorf("error creating repo directory %s: %v", repoDir, err)
            }

            repoFile, err := os.Create(filepath.Join(repoDir, "index.html"))
            if err != nil {
                return fmt.Errorf("error creating repo index.html: %v", err)
            }
            defer repoFile.Close()

            repoEntries := []binaryEntry{}
            for _, entry := range entriesWithIcons {
                if entry.RepoName == repo.Name {
                    repoEntries = append(repoEntries, entry)
                }
            }

            data := struct {
                TopEntries           []binaryEntry
                Categories           []struct{ Name string }
                Entries              []binaryEntry
                CategoryEntries      map[string][]binaryEntry
                RepoGroups           []RepoGroup
                CurrentRepoSelection string
            }{
                TopEntries:           topEntries,
                Categories:           categories,
                Entries:              repoEntries,
                CategoryEntries:      categoryEntries,
                RepoGroups:           repoGroupsSlice,
                CurrentRepoSelection: repo.Name,
            }

            if err := indexTmpl.Execute(repoFile, data); err != nil {
                return fmt.Errorf("error executing repo template: %v", err)
            }
        }
    }

    return nil
}

func main() {
    templatesDir := flag.String("templates-dir", "./templates", "Path to the templates directory")
    outputDir := flag.String("output-dir", "./output", "Path to the output directory")
    flag.Parse()

    config := &Config{
        RepoURLs:     []string{"https://raw.githubusercontent.com/xplshn/dbin-metadata/refs/heads/master/misc/cmd/1.4/pkgcache_amd64_linux.web.cbor.zst"},
        CacheDir:     ".cache",
        NoConfig:     false,
        OutputDir:    *outputDir,
        TemplatesDir: *templatesDir,
    }

    entries, err := decodeRepoIndex(config)
    if err != nil {
        fmt.Printf("Error decoding repo index: %v\n", err)
        return
    }

    if err := generateHTML(entries, config); err != nil {
        fmt.Printf("Error generating HTML: %v\n", err)
        return
    }

    fmt.Println("AppBundleHUB generated successfully!")
}
