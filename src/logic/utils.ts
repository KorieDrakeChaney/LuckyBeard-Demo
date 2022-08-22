

import { Texture, TextureLoader } from 'three'
import { StaticImageData } from 'next/image'




export const imageToTexture = (data : Array<StaticImageData> | StaticImageData):Array<Texture> | Texture => { 
    let i = 0;
    if(data instanceof Array<StaticImageData>){
        let textures = Array(data.length)
        for(const img of data){
            textures[i] = new TextureLoader().load( img.src )
            i++;
        }

        return textures; 
    }
    else{ 
        return new TextureLoader().load( data.src );
    }
}