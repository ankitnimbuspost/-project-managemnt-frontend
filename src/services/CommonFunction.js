const moment = require("moment");
const { default: callApis } = require("./CallAPI");
module.exports.convertBase64 =  async function(file){
    return new Promise((resolve,reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            resolve(reader.result)
        };
        reader.onerror = (error)=>{
            reject(error)
        }
    });
}
module.exports.authenticateUser =  function()
{
    let user = sessionStorage.getItem("user");
    if(user==undefined || user==null)
        return false;
    else
        return JSON.parse(user);
}
module.exports.fileTypeLists = {
    // Document Files
    doc: "Word Document",
    docx: "Word Document",
    pdf: "PDF Document",
    txt: "Text File",
    odt: "OpenDocument Text Document",
    rtf: "Rich Text Format",
    wps: "WPS Document",

    // Spreadsheet Files
    xls: "Excel Spreadsheet",
    xlsx: "Excel Spreadsheet",
    ods: "OpenDocument Spreadsheet",
    csv: "CSV File",

    // Presentation Files
    ppt: "PowerPoint Presentation",
    pptx: "PowerPoint Presentation",
    odp: "OpenDocument Presentation",

    // Image Files
    jpg: "JPEG Image",
    jpeg: "JPEG Image",
    png: "PNG Image",
    gif: "GIF Image",
    bmp: "Bitmap Image",
    tiff: "Tagged Image File Format",
    tif: "Tagged Image File Format",
    svg: "Scalable Vector Graphics",
    ico: "Icon File",
    webp: "WebP Image",

    // Audio Files
    mp3: "MP3 Audio",
    wav: "WAV Audio",
    aac: "AAC Audio",
    flac: "FLAC Audio",
    ogg: "OGG Audio",
    m4a: "M4A Audio",

    // Video Files
    mp4: "MP4 Video",
    avi: "AVI Video",
    mkv: "Matroska Video",
    mov: "MOV Video",
    wmv: "Windows Media Video",
    flv: "Flash Video",
    webm: "WebM Video",

    // Compressed Files
    zip: "ZIP Archive",
    rar: "RAR Archive",
    "7z": "7-Zip Archive",
    tar: "TAR Archive",
    gz: "GZIP Archive",
    bz2: "BZIP2 Archive",
    iso: "ISO Disk Image",

    // Executable Files
    exe: "Windows Executable File",
    msi: "Windows Installer File",
    apk: "Android Package",
    dmg: "macOS Disk Image",
    bin: "Binary File",

    // Code Files
    js: "JavaScript File",
    jsx: "React JavaScript File",
    ts: "TypeScript File",
    tsx: "React TypeScript File",
    html: "HTML File",
    css: "Cascading Style Sheet",
    scss: "Sassy CSS File",
    json: "JSON File",
    xml: "XML File",
    yaml: "YAML File",
    py: "Python Script",
    java: "Java Source File",
    cpp: "C++ Source File",
    c: "C Source File",
    cs: "C# Source File",
    php: "PHP Script",
    rb: "Ruby Script",
    go: "Go Source File",
    swift: "Swift Source File",
    sql: "SQL Script",

    // Fonts
    ttf: "TrueType Font",
    otf: "OpenType Font",
    woff: "Web Open Font Format",
    woff2: "Web Open Font Format 2",

    // Miscellaneous
    log: "Log File",
    md: "Markdown File",
    ini: "Initialization File",
    cfg: "Configuration File",
    dat: "Data File",
};

module.exports.formatFiles = async function(files){
    if(files.length==0)
        return [];

    let r_response_data = await callApis.uploadFilesM1("upload-files",files);
    if(r_response_data.code==200){
        //Convert in valid format 
        const f = Array.from(files).map((file,key) => {
            const fileName = file.name;
            const fileExtension = fileName.split(".").pop().toLowerCase();
            const fileDescription = module.exports.fileTypeLists[fileExtension] || "Unknown File Type";

            return {
                name: fileName,
                size: ((file.size / 1024)/1024).toFixed(2), // Size in MB
                extension: fileExtension,
                description: fileDescription,
                file_id: Date.now(),
                url:r_response_data.data[key].url
            };
        });
        return f;
    }
    else{
        console.log(r_response_data.message)
        alert(r_response_data.message)
        return []
    }
}
module.exports.convertChatDateTime = function(timestamp){
    return moment.unix(timestamp).format("dddd, MMMM Do, YYYY [at] h:mm A");
};