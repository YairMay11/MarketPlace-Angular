import { noUndefined } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { Path } from '../../config';
import { CategoriesService } from '../../services/categories.service';
import { SubCategoriesService } from '../../services/sub-categories.service';


declare var jQuery:any;
declare var $:any;
 
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  path:String = Path.url;
 /*  objectKeys = Object.keys; */
  categories:Object = null;
  arrayTitleList:Array<any>=[];
  render:Boolean = true;

  constructor(private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService) { }

  ngOnInit(): void {

    /* Tomamos la data de las categorias */

    this.categoriesService.getData()
    .subscribe(resp => {
      this.categories = resp;
      /* console.log("resp", resp); */

      /* Recorrido por la coleccion de categoria  para tomar la lista de titulos  */


      let i;

      for (i in resp){ 
        /* se separa la lista de titulos en indice  de un array*/
        this.arrayTitleList.push(JSON.parse(resp[i].title_list)
        /* .subscribe(resp =>{
          console.log("resp", resp);
        }) */
        )

        /* console.log("this.arrayTitleList", this.arrayTitleList); */

      }
    })

  }

  /* Funcion que nos avisa el renderizado de ANGULAR */
  callback(){
    if(this.render){
      this.render = false;

      let arraySubCategories = []
      /* console.log("this.render", this.render); */

      /* recorrido por la lista de titulos */

      this.arrayTitleList.forEach(titleList =>{
        /* console.log("titlelist", titlelist); */

        /* Separar individualmente cada uno de los titulos */

       for(let i = 0; i < titleList.length; i++){
          /* console.log("titlelist", titlelist[i]); */

          /* tomamos la coleccion de la subcategoria filtrando con la lista de titulos */

          this.subCategoriesService.getFilterData("title_list", titleList[i])
          .subscribe(resp =>{
            /* console.log("resp", resp); */

            arraySubCategories.push(resp); 

            /* Hacemos un recorrido por la coleccion general de Subcategorias */

            let f;
            let g;
            let arrayTitleName =[];
            for (f in arraySubCategories){

              /* console.log("arraySubCategories", arraySubCategories[f]); */
              for (g in arraySubCategories[f]){

               /*  Creamos un nuevo array de objetos clasificando cada subcartegoria con 
                la respectiva lista de titulo a la que pertenece  */
                arrayTitleName.push({
                  "titleList": arraySubCategories[f][g].title_list,
                  "subcategory": arraySubCategories[f][g].name,
                  "url": arraySubCategories[f][g].url,
                })

              }

            }
            /* Recorremos el array de objetos nuevos para buscar coincidencias  con las 
            listas de titulo  */
            for (f in arrayTitleName){

              if(titleList[i] == arrayTitleName[f].titleList){

               /*  console.log("arrayTitleName[f].subcategory", arrayTitleName[f].subcategory);

                 console.log("titleList[i]", titleList[i]);  */

                /*  Imprimir el nombre de la subcategoria en el nombre correspondiente  */
                $(`[titleList='${titleList[i]}']`).append(
                  `
                  <li>
                    <a href="products/${arrayTitleName[f].url}">${arrayTitleName[f].subcategory}</a>
                  </li>
                  `
                )
              }

            }

            

          })
          
          

        }
      })

    }
  }

}
