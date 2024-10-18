import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor() {}
  private img: any[] = [
    {
      itemImageSrc:
        'https://dataexport.com.gt/wp-content/uploads/2021/09/Exportaciones-12.jpg',
      thumbnailImageSrc:
        'https://dataexport.com.gt/wp-content/uploads/2021/09/Exportaciones-12.jpg',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      itemImageSrc:
        'https://fotografias.lasexta.com/clipping/cmsimages01/2020/05/15/142326A0-3596-448A-8CBC-33B84E56FD33/97.jpg?crop=1067,600,x68,y0&width=1600&height=900&optimize=high&format=webply',
      thumbnailImageSrc:
        'https://fotografias.lasexta.com/clipping/cmsimages01/2020/05/15/142326A0-3596-448A-8CBC-33B84E56FD33/97.jpg?crop=1067,600,x68,y0&width=1600&height=900&optimize=high&format=webply',
      alt: 'Description for Image 2',
      title: 'Title 2',
    },
    {
      itemImageSrc:
        'https://static.nationalgeographicla.com/files/styles/image_3200/public/temple-great-jaguar-tikal.webp?w=1450&h=816',
      thumbnailImageSrc:
        'https://static.nationalgeographicla.com/files/styles/image_3200/public/temple-great-jaguar-tikal.webp?w=1450&h=816',
      alt: 'Description for Image 2',
      title: 'Title 2',
    },
  ];
  private excursiones: any[] = [
    {
      itemImageSrc:
        'https://lahora.gt/wp-content/uploads/sites/5/2023/04/Volcan-Acatenango.jpeg',
      thumbnailImageSrc:
        'https://lahora.gt/wp-content/uploads/sites/5/2023/04/Volcan-Acatenango.jpeg',
      alt: 'Description for Image 4',
      title: 'Title 4',
    },
    {
      itemImageSrc:
        'https://clairexplore.s3.eu-west-3.amazonaws.com/large_IMG_0656_7ea98d350b.jpeg',
      thumbnailImageSrc:
        'https://clairexplore.s3.eu-west-3.amazonaws.com/large_IMG_0656_7ea98d350b.jpeg',
      alt: 'Description for Image 2',
      title: 'Title 2',
    },
    {
      itemImageSrc:
        'https://cdn.getyourguide.com/img/tour/1db7c96224bf626ae6f5187b2c9df9169d4154b6d2fa4ac65c8fc5f079c1895d.jpg/146.jpg',
      thumbnailImageSrc:
        'https://cdn.getyourguide.com/img/tour/1db7c96224bf626ae6f5187b2c9df9169d4154b6d2fa4ac65c8fc5f079c1895d.jpg/146.jpg',
      alt: 'Description for Image 2',
      title: 'Title 2',
    },
    {
      itemImageSrc:
        'https://craterazul.com/wp-content/themes/yootheme/cache/c3/experiencia-crater-azul.jpg-c31f371b.webp',
      thumbnailImageSrc:
        'https://craterazul.com/wp-content/themes/yootheme/cache/c3/experiencia-crater-azul.jpg-c31f371b.webp',
      alt: 'Description for Image 2',
      title: 'Title 2',
    },
    {
      itemImageSrc:
        'https://rubenyelmundo.com/wp-content/uploads/2024/02/InShot_20240227_221805588.webp',
      thumbnailImageSrc:
        'https://rubenyelmundo.com/wp-content/uploads/2024/02/InShot_20240227_221805588.webp',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
  
    {
      itemImageSrc:
        'https://aprende.guatemala.com/wp-content/uploads/2018/01/Mirador-Juan-Di%C3%A9guez-Olaverri-en-Huehuetenango1.jpg',
      thumbnailImageSrc:
        'https://aprende.guatemala.com/wp-content/uploads/2018/01/Mirador-Juan-Di%C3%A9guez-Olaverri-en-Huehuetenango1.jpg',
      alt: 'Description for Image 2',
      title: 'Title 2',
    },
  ];
  private traslados: any[] = [
    {
      itemImageSrc:
        'https://deltacomercial.com.do/cdn/modelos/hiace-pasajeros/a7326b5626a325795788d24671388f66.jpg',
      thumbnailImageSrc:
        'https://deltacomercial.com.do/cdn/modelos/hiace-pasajeros/a7326b5626a325795788d24671388f66.jpg',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      itemImageSrc:
        'https://casstrucking.com/wp-content/uploads/2019/09/0000142438.5c6628faa40e10d04c24c5197461fa5dbb0ddb7a.jpg',
      thumbnailImageSrc:
        'https://casstrucking.com/wp-content/uploads/2019/09/0000142438.5c6628faa40e10d04c24c5197461fa5dbb0ddb7a.jpg',
      alt: 'Description for Image 2',
      title: 'Title 2',
    },
  ];

  getImages() {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve(this.img);
      }, 1000);
    });
  }
  getExcursiones() {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve(this.excursiones);
      }, 1000);
    });
  }
  getTraslados() {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve(this.traslados);
      }, 1000);
    });
  }
}
