import {update, Tween, Easing} from "@tweenjs/tween.js";
import { Color, IUniform, Object3D, OrthographicCamera, PerspectiveCamera, Scene, Texture, Vector3, Vector4} from "three";



export default class AnimationSystem { 
    private constructor(){};

    static lerpCameraPosition(data : {position : Vector3, camera : PerspectiveCamera | OrthographicCamera, duration : number, preFunc? : () => void, updateFunc? : () => void, completeFunc? : () => void}) {
        let {position, camera, duration} = data;
        let preFunction = data.preFunc ? data.preFunc : () => {};
        let updateFunction = data.updateFunc ? data.updateFunc : () => {};
        let completeFunction = data.completeFunc ? data.completeFunc : () => {};
        
        preFunction();

        let coords = {
            x1 : camera.position.x, 
            y1 : camera.position.y, 
            z1 : camera.position.z};
                
        let to = {
            x1 : position.x,
            y1 : position.y,
            z1 : position.z,
        };

        new Tween(coords)
        .duration(duration)
        .to(to)
        .easing(Easing.Circular.InOut)
        .onUpdate(() => {
            updateFunction()
            camera.position.set(coords.x1, coords.y1, coords.z1);
        })
        .onComplete(() => {
            completeFunction()
        })
        .start()
        };


    static lerpObjectPosition(data : {position : Vector3, object : Object3D, duration : number, preFunc? : () => void, updateFunc? : () => void, completeFunc? : () => void}){
        let {position, object, duration} = data;
        let preFunction = data.preFunc ? data.preFunc : () => {};
        let updateFunction = data.updateFunc ? data.updateFunc : () => {};
        let completeFunction = data.completeFunc ? data.completeFunc : () => {};

        preFunction();

        let coords = {
            x1 : object.position.x, 
            y1 : object.position.y, 
            z1 : object.position.z};
                
        let to = {
            x1 : position.x,
            y1 : position.y,
            z1 : position.z,
        };

        new Tween(coords)
        .duration(duration)
        .to(to)
        .easing(Easing.Circular.InOut)
        .onUpdate(() => {
            object.position.copy(new Vector3(coords.x1, coords.y1, coords.z1))
            updateFunction();
        })
        .onComplete(() => {
            completeFunction()
        })
        .start()
    }

    static lerpScale(data : {value : Vector3, object : Object3D, duration : number,  preFunc? : () => void, updateFunc? : () => void, completeFunc? : () => void}){
        let {object, value, duration} = data;
        let preFunction = data.preFunc ? data.preFunc : () => {};
        let updateFunction = data.updateFunc ? data.updateFunc : () => {};
        let completeFunction = data.completeFunc ? data.completeFunc : () => {};

        preFunction();

        let start = object.scale;
            
        let to = value;

        new Tween(start)
        .duration(duration)
        .to(to)
        .easing(Easing.Circular.InOut)
        .onUpdate(() => {
            object.scale.copy(start);
            updateFunction();
        })
        .onComplete(() => {
            completeFunction();
        })
        .start()
    };

    static lerpUniformVec4(data : {uniforms : IUniform<Vector4>, values : Vector4, duration : number, preFunc? : () => void, updateFunc? : () => void, completeFunc? : () => void}) {
        let {uniforms, values, duration} = data;
        let preFunction = data.preFunc ? data.preFunc : () => {};
        let updateFunction = data.updateFunc ? data.updateFunc : () => {};
        let completeFunction = data.completeFunc ? data.completeFunc : () => {};

        preFunction();

        let start = {
            x : uniforms.value.x,
            y : uniforms.value.y,
            z : uniforms.value.z,
            w : uniforms.value.w,
        };
            
        let to = {
            x : values.x,
            y : values.y,
            z : values.z,
            w : values.w,
        };

        new Tween(start)
        .duration(duration)
        .to(to)
        .easing(Easing.Circular.InOut)
        .onUpdate(() => {
            uniforms.value = new Vector4(
                start.x, start.y, start.z, start.w
        );
            updateFunction();
        })
        .onComplete(() => {
            completeFunction();
        })
        .start()
        };

    static lerpUniformVec3(data : {uniforms : Array<IUniform<Vector3>>, values : Array<Vector3>, duration : number, preFunc? : () => void, updateFunc? : () => void, completeFunc? : () => void}) {
        let {uniforms, values, duration} = data;
        let preFunction = data.preFunc ? data.preFunc : () => {};
        let updateFunction = data.updateFunc ? data.updateFunc : () => {};
        let completeFunction = data.completeFunc ? data.completeFunc : () => {};

        preFunction();
        let start : any = [];
        for(let i = 0 ; i < uniforms.length; i++){
            start.push(uniforms[i].value);
        }

        let to = [];
        for(let i = 0 ; i < values.length; i++){
            to.push(values[i]);
        }

        new Tween(start)
        .duration(duration)
        .to(to)
        .easing(Easing.Circular.InOut)
        .onUpdate(() => {
            for(let i = 0 ; i < uniforms.length; i++){
                uniforms[i].value = new Vector3(start[i].x, start[i].y, start[i].z)
            }
            updateFunction();
        })
        .onComplete(() => {
            completeFunction();
        })
        .start()
        };

    static lerpUniformFloat(data : {uniforms : Array<IUniform<number>>, values : Array<number>, duration : number, preFunc? : () => void, updateFunc? : () => void, completeFunc? : () => void}) {
        let {uniforms, values, duration} = data;
        let preFunction = data.preFunc ? data.preFunc : () => {};
        let updateFunction = data.updateFunc ? data.updateFunc : () => {};
        let completeFunction = data.completeFunc ? data.completeFunc : () => {};

        preFunction();

        let start : any = [];
        for(let i = 0 ; i < uniforms.length; i++){
            start.push(uniforms[i].value);
        }

        let to = [];
        for(let i = 0 ; i < values.length; i++){
            to.push(values[i]);
        }

        new Tween(start)
        .duration(duration)
        .to(to)
        .easing(Easing.Circular.InOut)
        .onUpdate(() => {
            for(let i = 0 ; i < uniforms.length; i++){
                uniforms[i].value = start[i];
            }
            updateFunction();
        })
        .onComplete(() => {
            completeFunction()
        })
        .start()
    };

    static lerpBackgroundColor(data : {scene : Scene, prev : [number,  number, number], value : [number, number, number], duration : number, preFunc? : () => void, updateFunc? : () => void, completeFunc? : () => void}) {
        let {scene, prev, value, duration} = data;
        let preFunction = data.preFunc ? data.preFunc : () => {};
        let updateFunction = data.updateFunc ? data.updateFunc : () => {};
        let completeFunction = data.completeFunc ? data.completeFunc : () => {};

        preFunction();

        let start = prev;
   
        let to = value;
      

        new Tween(start)
        .duration(duration)
        .to(to)
        .easing(Easing.Circular.InOut)
        .onUpdate(() => {
            scene.background = new Color(start[0] / 255, start[1] / 255, start[2] / 255)
            updateFunction();
        })
        .onComplete(() => {
            completeFunction()
        })
        .start()
    };

    static update(){
        update();   
    }
}