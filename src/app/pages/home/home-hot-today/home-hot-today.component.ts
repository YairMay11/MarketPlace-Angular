import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import {OwlCarouselConfig, CarouselNavigation, SlickConfig, ProductLightbox, CountDown, Rating, ProgressBar} from '../../../functions';
import { ProductsService } from '../../../services/products.service';
import { SalesService } from '../../../services/sales.service';

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
  topSales:Array<any> = [];
  topSalesBlock:Array<any> = [];
  renderBestSeller:Boolean = true;

  constructor(private productsService: ProductsService,
              private salesService: SalesService) { }

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

        /* TOMAMOS LA DATA DE LAS VENTAS */ 

        let getSales = [];

        this.salesService.getData()

        .subscribe(resp =>{
          /* console.log('resp',resp); */

          /* RECORREMOS CADA VENTA PARA SEPARAR LOS PRODUCTOS Y LAS CANTIDADES */

          let i;

          for(i in resp){
          getSales.push({
              "product":resp[i].product,
              "quantity":resp[i].quantity

            })
          }

          /* ORDENAMOS DE MAYOR A MENOR EL ARREGLO DE OBJETOS */
          getSales.sort(function(a,b){
            return(b.quantity - a.quantity)
          })
          /* console.log('getSales',getSales); */
          /* SACAMOS DEL ARREGLO LOS PRODUCTOS REPETIDOS DEJANDO  LOS DE MAYOR VENTA */
          let filterSales = [];
          getSales.forEach( sale =>{
            if( !filterSales.find(resp => resp.product == sale.product)){
              const{product, quantity} = sale;
              filterSales.push({product,quantity})
            }
          })
          /* console.log('filterSales',filterSales); */
          /* FILTRAMOS LA DATA DE PRODUCTOS BUSCANDO COINCIDENCIAS CON LAS VENTAS */ 

          let block = 0;

          filterSales.forEach((sale, index)=>{
           
            /* FILTRAMOS HASTA 20 VENTAS */
            if(index < 20){
              block ++;
              this.productsService.getFilterData("name", sale.product)
              .subscribe( resp => {
                /* console.log('resp',resp); */
                let i;
                for(i in  resp){

                  this.topSales.push(resp[i])

                }
              })
            }
          })

          /* ENVIAMOS EL MAXIMO DE BLOQUES  PARA MOSTRAR 4 PRODUCTOS POR BLOQUE */
           /* console.log('block',block); */

           for(let i = 0; i < Math.ceil(block/4); i++){

            this.topSalesBlock.push(i);

           }
           /* console.log('this.topSalesBlock',this.topSalesBlock); */



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
      /*Ejecutar funciones globales con respecto a las Ofertas */			
      CountDown.fnc();
      /*Ejecutar funciones globales con respecto a las Reseñas */	
      Rating.fnc();
      /*Ejecutar funciones globales con respecto al Stock */
      ProgressBar.fnc();

    }
  }

   /* FUNCION QUE NOS AVISA CUANDO TERMINA EL RENDERIZADO de los BestSeller (TOP 20)  */
   callbackBestSeller(topSales){

    if (this.renderBestSeller){
      this.renderBestSeller = false;

      /* console.log('topSales',topSales); */
      /* CAPTURAMOS LA CANTIDAD DE BLOQUES QUE EXISTEN EN EL DOOM */

      let topSaleBlock = $(".topSaleBlock");
      let top20Array = [];

      /* EJECUTAMOS UN SetTimeOut | POR CADA BLOQUE UN SEGUNDO DE ESPERA */

      setTimeout(function(){

        /* REMOVEMOS EL PRELOAD */ 

        $(".preload").remove();

        /* HACEMOS UN CICLO POR LA CANTIDAD DE BLOQUES */

        for(let i = 0; i < topSaleBlock.length; i++){
        /* AGRUPAMOS LA CANTIDAD DE 4 PRODUCTOS POR BLOQUE */

        top20Array.push(

          topSales.slice(i*topSaleBlock.length, (i*topSaleBlock.length)+topSaleBlock.length)
        )

        /* HACEMOS UN RECORRIDO POR EL NUEVO ARRAY DE OBJETOS */
        let f;

        for(f in top20Array[i]){

          /* DEFINIMOS SI EL PRECIO DEL PRODUCTO TIENE OFERTA O NO */

          let price;
          let type;
          let value;
          let offer;

          if(top20Array[i][f].offer != ""){
            type = JSON.parse(top20Array[i][f].offer)[0];
            value = JSON.parse(top20Array[i][f].offer)[1];

            if(type ==  "Disccount"){
              offer = (top20Array[i][f].price * value/100).toFixed(2)
            }

            if(type ==  "Fixed"){
              offer = (top20Array[i][f].price - value).toFixed(2)
            }

            price = `<p class="ps-product__price sale">$${offer} &nbsp;<del>$${top20Array[i][f].price}</del></p>`

          }else{
            price = `<p class="ps-product__price">$${top20Array[i][f].price}</p>`
          }

          /* ADICIONAR A LA VISTA LOS PRODUCTOS CLASIFICADOS */

              $(topSaleBlock[i]).append(`
              <div class="ps-product--horizontal">

                                            <div class="ps-product__thumbnail">
                                            	<a href="product/${top20Array[i][f].url}">
                                            		<img src="assets/img/products/${top20Array[i][f].category}/${top20Array[i][f].image}" >
                                            	</a>
                                            </div>

                                            <div class="ps-product__content">

                                            	<a class="ps-product__title" href="product/${top20Array[i][f].url}">${top20Array[i][f].name}</a>

                                                ${price}

                                            </div>

                                        </div>
              `)
            }

      }
      /* console.log('top20Array',top20Array); */
     
      /* MODIFICAMOS LE ESTILO DEL PLUGIN OWL CAROUSEL */
      $(".owl-dots").css({"bottom":"0"})
				$(".owl-dot").css({"background":"#ddd"})
    }, topSaleBlock.length*1000)
      /* console.log('top20Array',top20Array); */

    }

   }

}
