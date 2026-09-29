$files = @(
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml'
)

foreach ($f in $files) {
    try {
        $content = Get-Content $f -Raw
        [xml]$xml = $content
        Write-Output "[$f] XML is 100% valid! Root: $($xml.DocumentElement.Name)"
    } catch {
        Write-Error "[$f] XML Parse Error: $_"
    }
}
