
import Sphere from "../../resources/Sphere.png";
import Cube from "../../resources/Cube.png";
import Dollos from "../../resources/Dollos.png";
import Cone from "../../resources/Cone.png";
import Torus from "../../resources/Torus.png";
import { FormEvent, MutableRefObject, useEffect, useRef, useState } from "react";

import styles from "./showcase.module.css"
import Display from "../../logic/display";

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;


let display : Display;
let current = 0;

enum itemPlacement {
    "Cube" = 0,
    "Cone" = 1,
    "Torus" = 2,
    "Sphere" = 3,
    "Dollos" = 4,
}

const Showcase = () => {

    const ref = useRef() as MutableRefObject<HTMLCanvasElement>;

    useEffect(() => {
      if(ref.current){
        display = new Display(ref.current, 
            [
                {size : [140, 80], img : Cube, index : itemPlacement["Cube"], color : getRGB("Cube")},
                {size : [140, 80], img : Cone, index : itemPlacement["Cone"], color : getRGB("Cone")},
                {size : [140, 80], img : Torus, index : itemPlacement["Torus"], color : getRGB("Torus")},
                {size : [140, 80], img : Sphere, index : itemPlacement["Sphere"], color : getRGB("Sphere")},
                {size : [140, 80], img : Dollos, index : itemPlacement["Dollos"], color : getRGB("Dollos")},
            ]);

        ref.current.addEventListener('touchstart', function(event : TouchEvent) {
            touchstartX = event.touches[0].clientX;
            touchstartY = event.touches[0].clientY;
        }, false);
    

        ref.current.addEventListener('touchmove', function(event : TouchEvent) {
                touchendX = event.touches[0].clientX;
                touchendY = event.touches[0].clientY;
        }, false);


        ref.current.addEventListener('touchend', function(event : TouchEvent) {
            if (touchendX < touchstartX) {
                display.toggleRight();
                setItem(getItem((display.currentIndex + 1) % 5))
            }
            else if (touchendX > touchstartX) {
                display.toggleLeft();
                setItem(getItem(display.currentIndex == 0 ? 4 : display.currentIndex - 1)) 
            }
            
        }, false); 

        ref.current.addEventListener("wheel", (event) => {
            if(event.deltaY < 0  && !display.isAnimating){
                display.toggleLeft();
                setItem(getItem(display.currentIndex == 0 ? 4 : display.currentIndex - 1)) 
                return;
            }
            else if(!display.isAnimating) { 
                display.toggleRight();
                setItem(getItem((display.currentIndex + 1) % 5))
                return;
            }
         }, false);
      }
    }, [ref])

    const [item, setItem] = useState<"Cube" | "Cone" | "Torus" | "Sphere" | "Dollos">("Cube")
    const [rgb, setRgb] = useState<[number, number, number]>([228, 215, 146]);


    useEffect(() => { 
        if(display != undefined && itemPlacement[item] != display.currentIndex && !display.isAnimating){
            display.toggleIndex(itemPlacement[item])
            setRgb(getRGB(item))
        }
        current = display.currentIndex;
        (document.getElementById(item) as HTMLInputElement).checked = true
    }, [item])

    const handleChange = (value : "Cube" | "Cone" | "Torus" | "Sphere" | "Dollos") => {
        if(!display.isAnimating){
            setItem(value)
        }
        else { 
            (document.getElementById(value) as HTMLInputElement).checked = false;
            (document.getElementById(item) as HTMLInputElement).checked = true
        }

    }

    const getRGB = (item : "Cube" | "Cone" | "Torus" | "Sphere" | "Dollos"):[number, number, number] => { 
        switch(item){
            case "Cube":
                return [228, 215, 146];
            case "Cone":
                return [225, 187, 171];
            case "Torus":
                return [176, 212, 206];
            case "Sphere":
                return [218, 160, 152];
            case "Dollos":
                return [136, 163, 146];              
        }
    }

    const getItem = (index : number):"Cube" | "Cone" | "Torus" | "Sphere" | "Dollos"  => {
        switch(index){
            case 0:
                return "Cube";
            case 1:
                return "Cone";
            case 2:
                return "Torus";
            case 3:
                return "Sphere";
            case 4:
                return "Dollos";              
        }
        return "Cube"
    }



    return (
        <div style={{ backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, transition : 'all 1s'}}>
        <div className={styles.buttonContainer}>
            <button onClick={() => {handleChange("Cube")}} style={{backgroundColor : `rgba(0,0,0,0)`, border : 'none'}}>
            <input type="radio" name="radio-btn" id="Cube" className = {styles.button}/>
            </button>
            <button onClick={() => {handleChange("Cone")}} style={{backgroundColor : `rgba(0,0,0,0)`, border : 'none'}}>
            <input type="radio" name="radio-btn" id="Cone" className = {styles.button}/>
            </button>
            <button onClick={() => {handleChange("Torus")}} style={{backgroundColor : `rgba(0,0,0,0)`, border : 'none'}}>
            <input type="radio" name="radio-btn" id="Torus" className = {styles.button}/>
            </button>
            <button onClick={() => {handleChange("Sphere")}} style={{backgroundColor : `rgba(0,0,0,0)`, border : 'none'}}>
            <input type="radio" name="radio-btn" id="Sphere" className = {styles.button}/>
            </button>
            <button onClick={() => {handleChange("Torus")}} style={{backgroundColor : `rgba(0,0,0,0)`, border : 'none'}}>
            <input type="radio" name="radio-btn" id="Dollos" className = {styles.button}/>
            </button>
        </div>
            <canvas ref={ref}
                className={styles.scene}
            />
        </div>
    )
}


export default Showcase;