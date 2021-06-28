import { Component, OnInit } from '@angular/core';

import { CategoriesService } from '../../../services/categories.service';
import { SubCategoriesService } from '../../../services/sub-categories.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-breadcrumb',
  templateUrl: './products-breadcrumb.component.html',
  styleUrls: ['./products-breadcrumb.component.css']
})
export class ProductsBreadcrumbComponent implements OnInit {

  breadcrumb:String = null;

  constructor(private categoriesService: CategoriesService,
              private subCategoriesService: SubCategoriesService,
              private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {

    /* Refrescamos el roter Link para actualizar la ruta de la pagina */

    /* this.activateRoute.params.subscribe(param =>{

    }) */

    let params = this.activateRoute.snapshot.params["param"];
    /* console.log('params',params); */

    /* FILTRAMOS LA DATA DE CATEGORIAS */
    this.categoriesService.getFilterData("url", params)
    .subscribe(resp1=>{

      if(Object.keys(resp1).length > 0){

      let i;

      for(i in resp1){
        this.breadcrumb = resp1[i].name;
      }
    }else{
      /* FILTRAMOS LA DATA DE CATEGORIAS */
      this.subCategoriesService.getFilterData("url", params)
      .subscribe(resp2=>{
  
        let i;
  
        for(i in resp2){
          this.breadcrumb = resp2[i].name;
          

    }
  })
}
      /* console.log('resp',resp); */
    })


  }

}
