Hex Color Codes:
bright green: 20e81b
bright red: fb1111

1. Use this to extract user agents into an almost array format for javascript
sed -e ':a' -e 'N' -e '$!ba' -e 's/\n/",\
"/g' userAgentsOrig.txt > userAgents.txt
