#!/usr/bin/env python3
"""Baut index.html aus den Modulen in src/.
Aufbau:
  src/shell.html     HTML-Grundgerüst mit Platzhaltern @@CSS@@ und @@JS@@
  src/css/*.css      Stylesheets (alphabetisch)
  src/js/*.js        Spielmodule (in Nummernreihenfolge, 00 bis 99)
Aufruf: python3 build.py
"""
import glob,os
root=os.path.dirname(os.path.abspath(__file__))
rd=lambda f:open(f,encoding='utf-8').read()
css=''.join(rd(f) for f in sorted(glob.glob(os.path.join(root,'src/css/*.css'))))
js=''.join(rd(f) for f in sorted(glob.glob(os.path.join(root,'src/js/*.js'))))
out=rd(os.path.join(root,'src/shell.html')).replace('@@CSS@@',css,1).replace('@@JS@@',js,1)
open(os.path.join(root,'index.html'),'w',encoding='utf-8').write(out)
print('index.html gebaut:',len(js.splitlines()),'Zeilen JS aus',len(glob.glob(os.path.join(root,'src/js/*.js'))),'Modulen')
