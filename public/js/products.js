const serverSocket = io()

const plantillaProducts = `
<ul>
    {{#each array}}
    <li>{{this.title}}: $ {{this.price}}</li>
    {{/each}}
</ul> 
<a href="/?limit={{limit}}&page={{prevPage}}">Prev</a>
[{{page}}]
<a href="/?limit={{limit}}&page={{nextPage}}">Next</a>
`
const armarHtmlProdcuts = Handlebars.compile(plantillaProducts)