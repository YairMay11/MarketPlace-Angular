import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { ProductsService } from '../../../services/products.service';
import {OwlCarouselConfig, CarouselNavigation, SlickConfig, ProductLightbox, CountDown, Rating} from '../../../functions';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-home-hot-today',
  templateUrl: './home-hot-today.component.html',
  styleUrls: ['./home-hot-today.component.css']
})
export class HomeHotTodayComponent implements OnInit {

  path:String = Path.url;
  indexes:Array<any> = [];
  products:Array<any> = [];
  render:Boolean = true;
  cargando:Boolean = false;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {

    this.cargando = true;

    let getProducts = [];
    let hoy = new Date();
    let fechaOferta = null;
    

    /* TOMAMOS LA DATA DE LOS PRODUCTOS */
    this.productsService.getData()
        .subscribe(resp =>{

          /* console.log('resp',resp); */

          /* Recorremos cada producto para separar las ofertas y el stock */
          let i;

          for (i in resp){

            getProducts.push({
              "offer": JSON.parse(resp[i].offer),
              "stock": resp[i].stock
            })
            this.products.push(resp[i]);
            /* console.log('getProducts',getProducts); */

          }
          /* RECORREMOS CADA OFERTA Y STOCK PARA CLASIFICAR LAS OFERTAS ACTUALES 
          Y LOS PRODUCTOS QUE SI TENGAN EL STOCK */

          for(i in getProducts){

            fechaOferta = new Date(
              /* GENERAR FECHA DE LA OFERTA */
              parseInt(getProducts[i]["offer"][2].split("-")[0]),
              parseInt(getProducts[i]["offer"][2].split("-")[1])-1,
              parseInt(getProducts[i]["offer"][2].split("-")[2])
    
            )
    
            if(hoy < fechaOferta && getProducts[i]["stock"] > 0){
    
              this.indexes.push(i);
              this.cargando = false;
              /* console.log('this.indexes',this.indexes); */
    
            }
    
    
          }

        })
  }
   /* FUNCION QUE NOS AVISA CUANDO TERMINA EL RENDERIZADO  */
   callback(){
    if (this.render){
      this.render = false;

        /* SELECCIONAMOS EL DOM DE LA GALERIA MIXTA */

        let galleryMix_1 = $(".galleryMix_1");
        let galleryMix_2 = $(".galleryMix_2");
        let galleryMix_3 = $(".galleryMix_3");

        /* console.log('galleryMix_1',galleryMix_1.length); */

        /* SELECCIONAMOS EL DOM DE LA OFERTA */

        let offer_1 = $(".offer_1");
        let offer_2 = $(".offer_2");
        let offer_3 = $(".offer_3");

        /* SELECCIONAMOS EL DOM DE LAS RESEÑAS */

        let review_1 = $(".review_1");
        let review_2 = $(".review_2");
        let review_3 = $(".review_3");

      /* RECORREMOS TODOS LOS INDICES DE LOS PRODUCTOS */

      for(let i = 0; i < galleryMix_1.length; i ++){
        
        /* RECORREMOS TODAS LAS FOTOGRAFIAS DE LAS GALERIAS DE CADA PRODUCTO */

        for(let f = 0; f < JSON.parse($(galleryMix_1[i]).attr("gallery")).length; f++){

          /* AGREGAR IMAGENES GRANDES */
          $(galleryMix_2[i]).append(

						`<div class="item">
	                    	<a href="assets/img/products/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]}">
	                    		
	                    		<img src="assets/img/products/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]}">
	                    	</a>
	                    </div>`

                    )

            /* AGREGAR IMAGENES PEQUEÑAS  */
            $(galleryMix_3[i]).append(
              `<div class="item">
                  <img src="assets/img/products/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]}">
                </div>`
          )

         /*  console.log('galleryMix_3[i]',galleryMix_3[i]); */
        }

           /* CAPTURAMOS EL ARRAY DE OFERRTAS DE CADA PRODUCTO */

           let offer = JSON.parse($(offer_1[i]).attr("offer"));

           /*   console.log('offer',offer[0]); */
             /* CAPTURAMOS EL PRECIO DE CADA PRODUCTO */
     
             let price = Number($(offer_1[i]).attr("price"));
     
             /* PREGUNTAMOS SI ES UNN DESCUENTO */
     
             if(offer[0] == "Disccount"){
     
                 $(offer_1[i]).html(
     
                   `<span>Save <br> $${(price * offer[1]/100).toFixed(2) }</span>`
     
               )
     
               $(offer_2[i]).html(`$${(price-(price * offer[1]/100)).toFixed(2)}`)	
             }
     
             /* PREGUNTAMOS SI EL PRECIO ES FIJO  */
     
             if(offer[0] == "Fixed"){
     
               $(offer_1[i]).html(
     
                 `<span>Save <br> $${(price-offer[1]).toFixed(2) }</span>`
     
               )
     
               $(offer_2[i]).html(`$${offer[1]}`)	
     
             }
              /* AGREGAMOS LA FECHA AL DESCONTADOR  */
     
              $(offer_3[i]).attr("data-time", 
     
                 new Date(
     
                 parseInt(offer[2].split("-")[0]),
                 parseInt(offer[2].split("-")[1])-1,
                 parseInt(offer[2].split("-")[2])
     
               )
     
             )

          /* REVIEW */

          /* CALCULAMOS EL TOTAL DE CALIFICACIONES DE LAS RESEÑAS */

          let totalReview = 0 ;

          for(let f = 0; f < JSON.parse($(review_1[i]).attr("reviews")).length; f++){

            totalReview += Number (

              JSON.parse($(review_1[i]).attr("reviews"))
              [f]["review"]
              
              )

          }                 
          /* console.log('totalReview',totalReview); */

          /* IMPRIMIMOS EL TOTAL DE LAS CALIFICACIONES PARA CADA PRODUCTO */

          let rating = Math.round(totalReview/JSON.parse($(review_1[i]).attr("reviews")).length);

          $(review_3[i]).html(rating);

          for(let f = 1; f<=5; f++ ){
            $(review_2[i]).append(
              `<option value="2">${f}</option>`
            )
            if(rating == f ){
              $(review_2[i]).children('option').val(1)
            }
          }


      }

      /* EJECUTAR FUNCIONES GLOBALES CON RESPECTO A LA GALERIA*/

      OwlCarouselConfig.fnc();
      CarouselNavigation.fnc();
      SlickConfig.fnc();
      ProductLightbox.fnc();
      /*Ejecutar funciones globales con respecto a las ofertas */			
      CountDown.fnc();
      /*Ejecutar funciones globales con respecto a las reseñas */	
      Rating.fnc();

    }
  }

}
