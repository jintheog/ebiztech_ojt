# figshot.html로 찍은 *-phone-*.png를 왼쪽 390px만 남기고 자른다 (headless 창 최소 폭이 504px이라서).
param([string]$Dir)
Add-Type -AssemblyName System.Drawing
Get-ChildItem $Dir -Filter "*-phone-*.png" | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  $bmp = New-Object System.Drawing.Bitmap 390, $img.Height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0,0,390,$img.Height), (New-Object System.Drawing.Rectangle 0,0,390,$img.Height), [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose(); $img.Dispose()
  $bmp.Save($_.FullName, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
}
