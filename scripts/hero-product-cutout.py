# Builds public/media/glea-hero-product.webp (transparent PNG-style WebP) from a white-background product render.
# Usage: python3 scripts/hero-product-cutout.py glea-cut-hero-white-lit 10 public/media/glea-hero-product.webp
# Needs Pillow, numpy, scipy. Writes a dark-background preview next to /tmp/t51 if that folder exists.
import sys
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage
name,T,out_p=sys.argv[1],int(sys.argv[2]),sys.argv[3]
im=Image.open(f'public/media/{name}.webp').convert('RGB'); a=np.asarray(im).astype(int)
dist=np.sqrt(((255-a)**2).sum(2))
near=dist<=T
lab,n=ndimage.label(near)
edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
bg=np.isin(lab,list(edge))
alpha=Image.fromarray(np.where(bg,0,255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.0))
out=im.copy(); out.putalpha(alpha)
bb=alpha.point(lambda v:255 if v>8 else 0).getbbox()
out=out.crop((bb[0]-4,bb[1]-4,bb[2]+4,bb[3]+4)); out.thumbnail((700,700))
out.save(out_p,'WEBP',quality=82,method=6)
bgc=Image.new('RGB',out.size,(40,30,25)); bgc.paste(out,(0,0),out); import os
if os.path.isdir('/tmp/t51'): bgc.save('/tmp/t51/'+os.path.basename(out_p).replace('.webp','-prev.jpg'))
print(name,out.size)
