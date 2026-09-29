try {
    $content = Get-Content 'webapp/pages/access/AccessPage.view.xml' -Raw
    [xml]$xml = $content
    Write-Output "XML is 100% valid! Root: $($xml.DocumentElement.Name)"
} catch {
    Write-Error "XML Parse Error: $_"
}
