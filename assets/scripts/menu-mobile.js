

    // pegando os elementos principais
    const closeBtn = document.getElementById('closeBtn') // botão de fechar
    const menuToggle = document.getElementById('menu-toggle') // menu mobile
    const menu = document.getElementById('menu') // menu 
    const separador = document.querySelector('.separador')

    // abre o menu mobile lateral
    function openSideMenu(){

        // exibindo o menu
        menu.setAttribute('style', 'display: initial')

        // alterando a classe da lista do menu
        const lista = document.querySelector('.menu-list')
        if(lista) lista.className = 'menu-list-toggle'

        // ocultando o separador de lista
        separador.setAttribute('style', 'display: none')

        // alterando a classe dos items da lista
        const items = document.querySelectorAll('.list-item')
        if(items){
            for(let item of items) item.className = 'list-item-toggle'
        }

        // exibindo o botão de fechar
        closeBtn.setAttribute('style', 'display: initial')
    }

    // fecha o menu mobile lateral
    function closeSideMenu(){

        // ocultando o menu
        menu.removeAttribute('style')

        // alterando a classe da lista do menu
        const lista = document.querySelector('.menu-list-toggle')
        if(lista) lista.className = 'menu-list'

        // mostrando o separador de lista
        separador.removeAttribute('style')

        // alterando a classe de cada item da lista
        const items = document.querySelectorAll('.list-item-toggle')
        if(items){
            for(let item of items) {item.className = 'list-item'}
        }

        // ocultando o botão de fechar
        closeBtn.removeAttribute('style')
    }

    // adicionando eventos
    menuToggle.onclick = openSideMenu
    closeBtn.onclick = closeSideMenu

    // fechando menu mobile ao clicar fora do próprio menu
    document.body.onclick = (e) => {
    if(e.target.id != 'menu-toggle'
    && e.target.className != 'menu-list-toggle') closeSideMenu()}

