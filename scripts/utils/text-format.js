export function asteriskToBold(text) {
    var bold = /\*(.*?)\*/gm;
    var html = text.replace(bold, "<span style='font-weight: 600'>$1</span>");            
    return html;
}