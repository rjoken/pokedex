for /r %%i in (*.png) do magick mogrify %%i -fuzz 10%% -bordercolor white -border 1 -fill none -draw "alpha 0,0 floodfill" %%i
pause