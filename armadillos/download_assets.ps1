function New-AssetDirectory($path) {
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Force -Path $path | Out-Null
    }
}

$dest = "C:\Users\QUBIT\Desktop\jacmic\Armadillos\assets\images"
New-AssetDirectory $dest

$assets = @{
    "logo-full.png"        = "https://armadillos-deployment.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FarmadillosLogoFull.890a0cc2.png&w=3840&q=100"
    "logo-icon.png"        = "https://armadillos-deployment.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.09e7a2f2.png&w=3840&q=100"
    "icon-minerals.svg"    = "https://armadillos-deployment.vercel.app/_next/static/media/minerals.481b6210.svg"
    "icon-realestate.svg"  = "https://armadillos-deployment.vercel.app/_next/static/media/realestate.4708f6bb.svg"
    "icon-agriculture.svg" = "https://armadillos-deployment.vercel.app/_next/static/media/agriculture.028639e6.svg"
    "mining.jpg"           = "https://armadillos-deployment.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fminig%20chemicals2.efce0940.jpg&w=3840&q=75"
    "apartment.jpg"        = "https://armadillos-deployment.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FApartment%20Pool.01f6d61c.jpg&w=1920&q=75"
    "farming.jpg"          = "https://armadillos-deployment.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffarm-themes.c4c7f838.jpg&w=3840&q=75"
}

foreach ($name in $assets.Keys) {
    $url = $assets[$name]
    $output = Join-Path $dest $name
    Write-Host "Downloading $name..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $output
        Write-Host "Saved to $output"
    }
    catch {
        Write-Error "Failed to download $name : $_"
    }
}
