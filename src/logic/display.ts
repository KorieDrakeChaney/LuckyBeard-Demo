import { StaticImageData } from "next/image";
import { Color, Mesh, Group, PerspectiveCamera, PlaneBufferGeometry, Scene, ShaderMaterial, WebGLRenderer, Vector3, Texture, Vector2, Clock } from "three";
import LongShape from "../resources/LongShape.png";
import { imageToTexture } from "./utils";

import itemVertex from "../shaders/item/vertex.glsl";
import itemFragment from "../shaders/item/fragment.glsl";

import longVertex from "../shaders/longShape/vertex.glsl";
import longFragment from "../shaders/longShape/fragment.glsl";

import AnimationSystem from "./animationSystem";

let mouse = new Vector2(0, 0);

let clock = new Clock();
clock.start()

interface DisplayProps { 
    size : [number,  number], 
    index : number, 
    color : [number, number, number], 
    texture : Texture
}

class DisplayItem {
    public object : Mesh;
    public color : [number, number, number];
    public index : number;
    constructor(data : DisplayProps){

        const {size, index, color, texture} = data;
        this.index = index;
        this.color = color;

        this.object = new Mesh(new PlaneBufferGeometry(size[0], size[1]), new ShaderMaterial({
            uniforms : {
                textr : {value : texture}, 
                u_lerpValue : {value : index == 0 ? 1.0 : 0.0}
            }, 
            vertexShader : itemVertex, 
            fragmentShader : itemFragment, 
            transparent : true
        }))
    
    }
}

export default class Display { 
    private scene : Scene = new Scene();
    private renderer : WebGLRenderer;
    private camera : PerspectiveCamera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    private items : Array<DisplayItem> = new Array();
    private spotlightPos : Vector3 =  new Vector3(-35, 2.5, -100);
    private backgroundPos : Vector3 = new Vector3(-45, 2.5, -100)
    public currentIndex : number = 0;
    private background : Mesh;
    public isAnimating : boolean = false;
    constructor(canvas : HTMLCanvasElement, items : Array<{size : [number,  number], img : StaticImageData, index : number, color : [number, number, number]}>){
        this.renderer = new WebGLRenderer({canvas, antialias : true, stencil : false, depth : true, powerPreference : "high-performance"});
        this.scene.background = new Color(items[0].color[0] / 255, items[0].color[1] / 255, items[0].color[2] / 255)
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer.setSize(width,  height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        let texture = imageToTexture(LongShape);

        (texture as Texture).anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        this.background = new Mesh(new PlaneBufferGeometry(90, 30), new ShaderMaterial(
            {
                uniforms : {
                    textr : {value : texture}, 
                    tx : {value : 0}, 
                    ty : {value : 1}, 
                    time : {value : clock.elapsedTime},
                    u_Resolution : {value : new Vector2(width, height)}
                }, 
                vertexShader : longVertex, 
                fragmentShader : longFragment, 
                transparent : true
            }
        ))

        this.background.position.z = -100
        this.background.position.x = -30;
        this.background.rotateOnAxis(new Vector3(0, 0, 1), Math.PI / 2)

        this.scene.add(this.background);

        for(const item of items){
            let texture = imageToTexture(item.img);
            (texture as Texture).anisotropy = this.renderer.capabilities.getMaxAnisotropy();

            this.items.push(new DisplayItem({...item, ...{texture}} as DisplayProps));
            this.scene.add(this.items[this.items.length - 1].object)
            if(item.index == 0) this.items[this.items.length - 1].object.position.copy(this.spotlightPos)
            else this.items[this.items.length - 1].object.position.copy(this.backgroundPos)
        }   

        document.addEventListener('mousemove', this.onMouseMove.bind(this))

        requestAnimationFrame(this.update.bind(this));
    }

    onMouseMove(event : MouseEvent){
        let canvasBounds = this.renderer.domElement.getBoundingClientRect();
        mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) )  * 2 - 1;
        mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

        ((this.background as Mesh).material as ShaderMaterial).uniforms.tx.value = mouse.x;
        ((this.background as Mesh).material as ShaderMaterial).uniforms.ty.value = mouse.x;


    }

    toggleRight(){
        if(this.isAnimating) return;
        let next = this.currentIndex == (this.items.length - 1) ? 0 : this.currentIndex + 1;
        this.isAnimating = true;

        AnimationSystem.lerpScale({
            value : new Vector3(1, 2, 1), 
            object : this.background,
            duration : 1000, 
        })
        AnimationSystem.lerpObjectPosition(
            {position : new Vector3(-25, 2.5, -100), object : this.items[this.currentIndex].object, duration : 1000}, 
        )
        AnimationSystem.lerpUniformFloat({
            uniforms : [
                ((this.items[this.currentIndex].object as Mesh).material as ShaderMaterial).uniforms.u_lerpValue
            ], 
            completeFunc : () => { 
                AnimationSystem.lerpScale({
                    value : new Vector3(1, 1, 1), 
                    object : this.background,
                    duration : 1000, 
                })
                AnimationSystem.lerpObjectPosition(
                    {position : new Vector3(-35, 2.5, -100), object : this.items[next].object, duration : 1000}, 
                )
                AnimationSystem.lerpUniformFloat({
                    uniforms : [
                        ((this.items[next].object as Mesh).material as ShaderMaterial).uniforms.u_lerpValue
                    ],
                    values : [1], 
                    duration : 1000
                })
                AnimationSystem.lerpBackgroundColor({
                    scene : this.scene,
                    prev : [...this.items[this.currentIndex].color],
                    value : [...this.items[next].color], 
                    duration : 1500, 
                    completeFunc:  () => { 
                        this.isAnimating = false;
                    }
                })
                this.items[this.currentIndex].object.position.copy(this.backgroundPos);
                this.currentIndex = next
            },
            values : [0], 
            duration : 1000
        })
    }

    toggleLeft(){
        if(this.isAnimating) return;
        let next = this.currentIndex == 0 ? this.items.length - 1 : this.currentIndex - 1;
        this.isAnimating = true;

        AnimationSystem.lerpScale({
            value : new Vector3(1, 2, 1), 
            object : this.background,
            duration : 1000, 
        })
        AnimationSystem.lerpObjectPosition(
            {position : new Vector3(-25, 2.5, -100), object : this.items[this.currentIndex].object, duration : 1000}, 
        )
        AnimationSystem.lerpUniformFloat({
            uniforms : [
                ((this.items[this.currentIndex].object as Mesh).material as ShaderMaterial).uniforms.u_lerpValue
            ], 
            completeFunc : () => { 

                AnimationSystem.lerpScale({
                    value : new Vector3(1, 1, 1), 
                    object : this.background,
                    duration : 1000, 
                })

                AnimationSystem.lerpObjectPosition(
                    {position : new Vector3(-35, 2.5, -100), object : this.items[next].object, duration : 1000}, 
                )
                AnimationSystem.lerpUniformFloat({
                    uniforms : [
                        ((this.items[next].object as Mesh).material as ShaderMaterial).uniforms.u_lerpValue
                    ],
                    values : [1], 
                    duration : 1000
                })
                AnimationSystem.lerpBackgroundColor({
                    scene : this.scene,
                    prev : [...this.items[this.currentIndex].color],
                    value : [...this.items[next].color], 
                    duration : 1500,
                    completeFunc:  () => { 
                        this.isAnimating = false;
                    }
                })
                this.items[this.currentIndex].object.position.copy(this.backgroundPos);
                this.currentIndex = next

            },
            values : [0], 
            duration : 1000
        })
    }

    toggleIndex(index : number){
        if(this.isAnimating) return;
        if(index >= this.items.length) index = 0;
        let next = index;

        this.isAnimating = true;

        AnimationSystem.lerpScale({
            value : new Vector3(1, 2, 1), 
            object : this.background,
            duration : 1000, 
        })
        AnimationSystem.lerpObjectPosition(
            {position : new Vector3(-25, 2.5, -100), object : this.items[this.currentIndex].object, duration : 1000}, 
        )
        AnimationSystem.lerpUniformFloat({
            uniforms : [
                ((this.items[this.currentIndex].object as Mesh).material as ShaderMaterial).uniforms.u_lerpValue
            ], 
            completeFunc : () => { 
                
                AnimationSystem.lerpScale({
                    value : new Vector3(1, 1, 1), 
                    object : this.background,
                    duration : 1000, 
                })
                AnimationSystem.lerpObjectPosition(
                    {position : new Vector3(-35, 2.5, -100), object : this.items[next].object, duration : 1000}, 
                )
                AnimationSystem.lerpUniformFloat({
                    uniforms : [
                        ((this.items[next].object as Mesh).material as ShaderMaterial).uniforms.u_lerpValue
                    ],
                    values : [1], 
                    duration : 1000
                })
                AnimationSystem.lerpBackgroundColor({
                    scene : this.scene,
                    prev : [...this.items[this.currentIndex].color],
                    value : [...this.items[next].color],
                    duration : 1500,
                    completeFunc:  () => { 
                        this.isAnimating = false;
                    }
                })

                this.items[this.currentIndex].object.position.copy(this.backgroundPos);
                this.currentIndex = next

            },
            values : [0], 
            duration : 1000
        })

    }

    onResize(){
        const canvas = (this.renderer.domElement as HTMLCanvasElement)
        const width  = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
           this.renderer.setSize(width, height, false);
           this.camera.aspect = width / height;
           this.camera.updateProjectionMatrix();
           ((this.background as Mesh).material as ShaderMaterial).uniforms.u_Resolution.value = new Vector2(width, height)
        }
    }

    update(){
        this.onResize();
        this.renderer.clear();
        ((this.background as Mesh).material as ShaderMaterial).uniforms.time.value = clock.getElapsedTime();
        AnimationSystem.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update.bind(this));

    }
}