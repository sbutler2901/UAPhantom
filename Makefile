build:
	cd parser && node parser.js

package:
	rm -f UAPhantom.zip && zip -r UAPhantom.zip globals.js main.js manifest.json helpers icons options popup -x icons/Phantom.xcf \*.DS_Store
