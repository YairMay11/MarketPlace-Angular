import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';

import { CategoriesService } from '../../services/categories.service';
import { SubCategoriesService } from '../../services/sub-categories.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css']
})
export class HeaderMobileComponent implements OnInit {

  path:String = Path.url;
  categories:Object = null;
  render:Boolean = true;
  categoriesList:Array<any> = [];

  constructor(private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService) { }

  ngOnInit(): void {

     /* Tomamos la data de las categorias */

     this.categoriesService.getData()
     .subscribe(resp => {
       this.categories = resp;
        /* console.log("resp", resp);  */
        /* Recorrido por el objeto de la Data de Categorias */

        let i;

        for(i in resp){
          /* Separamos los nombres de las categorias */
          this.categoriesList.push(resp[i].name)
        }
     })

     /*Activar el efecto Toggle en el listado de subcategorias */
     $(document).on("click", ".sub-toggle", function(){
       $(this).parent().children('ul').toggle();
     })
  }

  /*funcion que nos avisa cuando termina el renderizaado de Angular */
  callback(){
    if(this.render){
      this.render = false;

      let arraySubCategories = []
      /* console.log("this.categoriesList",this.categoriesList); */
      /* console.log("this.render", this.render); */

      /* Separar las categorias  */

      this.categoriesList.forEach(category=>{
      /* console.log("category", category); */

      /* Tomamos la coleccion de las Sub-Categorias filtrando con el nombre de las categorias */
      this.subCategoriesService.getFilterData("category", category)
      .subscribe(resp=>{
        /* console.log("resp", resp); */

        /* Hacemos un recorrido por la coleccion general de Sub-categoria y clasificamos
        de acuerdo a la categoria correspondiente */

        let i;
        for(i in resp){
          
          arraySubCategories.push({
            "category": resp[i].category,
            "subcategory": resp[i].name,
            "url": resp[i].url,
          })
        }
        /* console.log('arraySubCategories',arraySubCategories); */

        /* Recorremos el array de objetos nuevo para buscar coincidencias con los nombres de categorias */

        for(i in arraySubCategories){
          if(category == arraySubCategories[i].category)

          $(`[category='${category}']`).append(

          `<li class="current-menu-item ">
          <a href="products/${arraySubCategories[i].url}">${arraySubCategories[i].subcategory}</a>
                  </li>`
                  )
        }



      })



      })
    }
  }

}
