```
unstable => (limit)

i am developing it with proxies regated from LAN, maybe it will be updated here or branch or paid version
```

# Step to step
### Setup project
```
git clone https://github.com/john-nv/tool-to-convert-text-in-image-to-text-in-multiple-languages-nodejs.git
cd tool-to-convert-text-in-image-to-text-in-multiple-languages-nodejs
npm i
```
### what to do

```
├── data-language        <= where the txt file will be created
│   └── 17-23-00_lang-JAPANESE.txt <= txt example
├── index.js
├── package.json
├── package-lock.json
├── photo-storage        <= where to store images each time you convert
│   ├── 1.png            <= image example
│   ├── 2.png
│   ├── 3.png
│   ├── 4.png
│   ├── 5.png
│   ├── 6.png
│   └── 7.png
└── Readme.md

```

change information in ``.env`` file

```
language='JAPANESE'        <= language in pictures
output='Text Plain (txt)'  <= undeveloped, keep it
timeout=60000              <= processing time of 1 image

```

### start tool

```
node start
```

see progress in browser

Default is off => ```({ headless: true })```

if you want to see leave it as false

```
const browser = await puppeteer.launch({ headless: true });
```

### Example image when it's done

- I'll try it with Japanese

``/data-language/<log terminal>``

![log terminal](https://i.imgur.com/MHhboeM.png)

``/data-language/<auto generated file name>``

![auto generated file name](https://i.imgur.com/CBEr2DV.png)