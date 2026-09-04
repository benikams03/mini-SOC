export function code_link() {

    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for(let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * caracteres.length)
        code += caracteres[index]
    }
    return code

}