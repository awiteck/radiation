// Title ideas:
// Radiation
// Cosmogramma

const DIM = Math.min(window.innerWidth, window.innerHeight)
const W = DIM
const H = DIM
const U = DIM / 500
console.log(W)

/* The following class is copied from mjlindow */
class Random {
    random_dec = () => fxrand()
    random_num = (a, b) => a+(b-a)*this.random_dec()
    random_int = (a, b) => Math.floor(this.random_num(a, b+1))
    random_idx = (arr) => arr[this.random_int(0, arr.length-1)]
}
const R = new Random()

const NUM_WAVES = R.random_int(4, 8);
const NUM_RAYS = R.random_int(100, 300)
const noiseAmp = 2;
const x = R.random_int(-W/2+W/5, W/2-W/5);
const y = R.random_int(-H/2+H/5, H/2-H/5);
const r = R.random_int(0, H/8);
const typeStars = 3;
const amplitudes = genAmplitudes(NUM_WAVES);
const sincos = genSinCos(NUM_WAVES);
const rArray = genRArr();
const fade = R.random_dec() < 0.3 ? true : false
const stagger = fade || R.random_dec()>1.0/7 ? false : true
const spiral = R.random_dec() < 0.5 ? true : false
const spiralStep = R.random_num(0.0005, 0.005);
let starCenters = []
const starRange = R.random_dec() < 0.3 ? true : false
const starSpiral = !starRange && R.random_dec() < 0.5 ? true : false

function genAmplitudes(numWaves) {
    let amps = [];
    for (let i = 0; i < numWaves; i++) 
        amps.push(R.random_dec());
    return amps;
}


function genSinCos(numWaves) {
    let sinCos = [];
    for (let i = 0; i < numWaves; i++) 
        sinCos.push(R.random_int(0, 1));
    return sinCos;
}

// Takes amplitude array, angle at which to get intensity, 
// and sinCos array (which is binary and has the same length as amplitudes)
// Theta is in degrees, gets converted to radians for 
function getIntensity(amps, sinCos, theta) {
    let val = 0;
    for (let i = 0; i < amps.length; i++) {
        if (sinCos[i] == 0)    // cosine
            val += amps[i] * Math.cos((i+1) * theta * 2 * Math.PI / 180)
        else   // sine
            val += amps[i] * Math.sin((i+1) * theta * 2 * Math.PI / 180)
    }
    return val**2;
}


function genRArr() {
    let rArr = []
    let maxLen = Math.sqrt(W**2 + H**2)
    for (let i = r; i < maxLen; i++) {
        rArr.push(i)
    }
    return rArr;
}


class Ray {
    constructor(theta) {
        this.theta = theta;
    }

    render() {
        push()
        stroke(P.rays())
        let intensity = getIntensity(amplitudes, sincos, this.theta)
        let thetaRad = this.theta * Math.PI/180

        /* CODE FOR ARTICLE */
        /*
        for (let i = 0; i < rArray.length; i++) {
            if (R.random_dec() < intensity) {
                let eps = R.random_num(-noiseAmp, noiseAmp);
                if (spiral) {
                    point(Math.floor(x + rArray[i] * Math.cos(thetaRad ) + eps*Math.sin(thetaRad)), 
                    Math.floor(y + rArray[i] * Math.sin(thetaRad ) + eps*Math.cos(thetaRad)))
                }
                else {
                    point(Math.floor(x + rArray[i] * Math.cos(thetaRad) + eps*Math.sin(thetaRad)), 
                    Math.floor(y + rArray[i] * Math.sin(thetaRad) + eps*Math.cos(thetaRad)))
                }
            }
        }
        */
        
        
        if (fade){
            let decayConst = R.random_num(0.006, 0.01)
            for (let i = 0; i < rArray.length; i++) {
                if (R.random_dec() < intensity*Math.exp(-decayConst*rArray[i])) {
                    let eps = R.random_num(-noiseAmp, noiseAmp);
                    if (spiral) {
                        point(Math.floor(x + rArray[i] * Math.cos(thetaRad + i * spiralStep) + eps*Math.sin(thetaRad)), 
                        Math.floor(y + rArray[i] * Math.sin(thetaRad + i * spiralStep) + eps*Math.cos(thetaRad)))
                    }
                    else {
                        point(Math.floor(x + rArray[i] * Math.cos(thetaRad) + eps*Math.sin(thetaRad)), 
                        Math.floor(y + rArray[i] * Math.sin(thetaRad) + eps*Math.cos(thetaRad)))
                    }
                }
            }
        }
        else if (stagger) {
            let rayLength = intensity*R.random_int(80, 120)
            for (let i = 0; i < rArray.length && rArray[i]<rayLength; i++) {
                if (R.random_dec() < intensity) {
                    let eps = R.random_num(-noiseAmp, noiseAmp);
                    if (spiral) {
                        point(Math.floor(x + rArray[i] * Math.cos(thetaRad + i * spiralStep) + eps*Math.sin(thetaRad)), 
                        Math.floor(y + rArray[i] * Math.sin(thetaRad + i * spiralStep) + eps*Math.cos(thetaRad)))
                    }
                    else {
                        point(Math.floor(x + rArray[i] * Math.cos(thetaRad) + eps*Math.sin(thetaRad)), 
                        Math.floor(y + rArray[i] * Math.sin(thetaRad) + eps*Math.cos(thetaRad)))
                    }
                }
            }
        }

        else {
            for (let i = 0; i < rArray.length; i++) {
                if (R.random_dec() < intensity) {
                    let eps = R.random_num(-noiseAmp, noiseAmp);
                    if (spiral) {
                        point(Math.floor(x + rArray[i] * Math.cos(thetaRad + i * spiralStep) + eps*Math.sin(thetaRad)), 
                        Math.floor(y + rArray[i] * Math.sin(thetaRad + i * spiralStep) + eps*Math.cos(thetaRad)))
                    }
                    else{
                    point(Math.floor(x + rArray[i] * Math.cos(thetaRad) + eps*Math.sin(thetaRad)), 
                        Math.floor(y + rArray[i] * Math.sin(thetaRad) + eps*Math.cos(thetaRad)))
                    }
                }
            }
        }
        
        pop()
    }
}

class Star {
    constructor (xStar, yStar, rStar, noise) {
        this.x = xStar;
        this.y = yStar;
        this.r = rStar;
        this.starNoise = noise
    }

    render() {
        push()
        let intersects = false;
        console.log("length: ", starCenters.length)
        for (let i = 0; i < starCenters.length; i++) 
            if ((this.x - starCenters[i].x)**2 + (this.y - starCenters[i].y)**2 < (this.r+starCenters[i].z)**2)
                return;//interescts = true;
        //if (!intersects) {
            
        //}
        starCenters.push(createVector(this.x, this.y, this.r))
        stroke(P.stars());
        let n = this.r * 2 * Math.PI
        if (fade) {
            for (let i = 0; i < n; i++) {
                let theta = 2 * Math.PI * i / n;    // Radians
                let intensity = getIntensity(amplitudes, sincos, theta);
                let dist = Math.sqrt((this.x-x)**2+(this.y-y)**2);
                let decayConst = R.random_num(0.006, 0.01);
                if (R.random_dec() < intensity*Math.exp(-decayConst*dist)) {
                    let rnoise = R.random_num(0, this.starNoise)
                    point(this.x+Math.floor((this.r+rnoise) * Math.cos(theta)), 
                        this.y+Math.floor((this.r+rnoise) * Math.sin(theta)))
                }
            }
        }
        else {
            for (let i = 0; i < n; i++) {
                let theta = 2 * Math.PI * i / n;    // Radians
                let intensity = getIntensity(amplitudes, sincos, theta);
                if (R.random_dec() < intensity) {
                    let rnoise = R.random_num(0, this.starNoise)
                    point(this.x+Math.floor((this.r+rnoise) * Math.cos(theta)), 
                        this.y+Math.floor((this.r+rnoise) * Math.sin(theta)))
                }
            }
        }
        
            
        
        strokeWeight(1)
        //noFill()
        // fill(245,241,210, 200)
        fill(P.background())
        ellipse(this.x, this.y, 2*this.r, 2*this.r)
        
        let xSpace = 2//R.random_int(5,10)
        
        // fill in 
        let randnum = R.random_dec()
        if (randnum < 1){///typeStars) {       // noisy lines
            push();
            stroke(P.stars());
            let lineNoise = 1//R.random_int(Math.floor(xSpace/5), Math.floor(xSpace/2))
            for (let i = -2*this.r/xSpace-2; i < 2*this.r/xSpace+2; i+=xSpace) {
                for (let j = -2*this.r; j < 2*this.r; j++) {
                    if (i**2+j**2 < this.r**2) {
                        point(this.x+i+Math.floor(R.random_num(-lineNoise, lineNoise)), this.y+j);
                    }
                }
            }
            pop(); 
        }

        else if (randnum < 2/typeStars) {   // straight line fill
            let theta = R.random_num(0, Math.PI);
            push();
            stroke(P.stars());
            
            for (let i = -2*this.r/xSpace-2; i < 2*this.r/xSpace+2; i+=xSpace) {
                for (let j = -2*this.r; j < 2*this.r; j++) {
                    if (i**2+j**2 < this.r**2) {
                        point(this.x+i, this.y+j);
                    }
                }
            }
            pop();
        }         
        
        else if (randnum < 3/typeStars){
            push()
            let gp = createGraphics(W, H)
            gp.strokeWeight(.7)
            gp.background(P.background())
            gp.stroke(P.stars())

            let theta = R.random_num(0, Math.PI);
            gp.rotate(theta)
            gp.translate(this.x, this.y)
            for (let i = -W; i < W; i+= 1.5*xSpace) {
                gp.line(i, -H, i, H)
                gp.line(-W, i, W, i)
            } 

            const fill = createImage(W, H)
            fill.copy(gp,  0,0,W,H, 0,0,W,H)
            gp = createGraphics(W, H)

            gp.circle(this.x + W/2, this.y + H/2, 2*this.r)

            //gp.rect(W/2, H/2, 50, 50)
            gp.rect(0, 0, 500, 500)
            //gp.ellipse(W/2, H/2, 50, 50)
            const mask = createImage(W, H)
            mask.copy(gp,  0,0,W,H, 0,0,W,H)
            fill.mask(mask)
            image(fill,  -W/2,-H/2,W,H)
            pop()
            /*
            push();
            stroke(P.stars());
            let theta = R.random_num(0, Math.PI);
            
            translate(-this.x, -this.y)
            rotate(theta);
            for (let i = -2*this.r/xSpace-2; i < 2*this.r/xSpace+2; i+=xSpace) {
                for (let j = -2*this.r; j < 2*this.r; j++) {
                    if (i**2+j**2 < this.r**2) {
                        point(this.x+i, this.y+j);
                        point(this.x+j, this.y+i);
                    }
                }
            }  
            //rotate(-theta);
            //translate(this.x, this.y)
            pop();
            */
        }
        pop();
    }
}


class Background {
    render() {
        push()
        strokeWeight(0.2)
        if (P.name == "Rose") {
            strokeWeight(0.05)
        }
        stroke(P.dust())
        for(let i = 0; i < 50000; i++){
            let xt = R.random_num(-W/2, W/2)
            let yt = R.random_num(-H/2, H/2)
            let at = 0//R.random_num(0, 2*Math.PI/10)
            let lt = R.random_num(2, 5)*U
            line(xt,yt, xt+Math.cos(at)*lt, yt+Math.sin(at)*lt)
            //circle(xt,yt, R.random_num(2,5)*U)

            let xt2 = R.random_num(-W/2, W/2)
            let yt2 = R.random_num(-H/2, H/2)
            line(xt2,yt2, xt2, yt2+lt)
        }

        pop()
    }
}






class Palette{
    constructor(){
        this.colors = R.random_idx([
        // Background     rays              star            dust         name 
        /*[color(186,190,177), color(0), color(0), color(160), 'ClassicCosmo'],
        [color(0), color(245,241,210), color(245,241,210), color(75), 'DarkCosmo'],
        [color(33, 35, 84), color(255), color(137, 243, 255), color(100), 'Pacific'],
        [color(0), color(229,205,137), color(122,41,6), color(50), "Amber"],
        [color(227,126,155), color(0), color(0), color(139,0,0), "Rose"],
        [color(0), color(245, 128, 37), color(255), color(100), 'Princeton'],
        [color(248, 240, 227), color(0), color(0), color(240), "Cream"],
        [color(255), color(155), color(155), color(240), "Void"],
        [color(221,63,81),  color(54,53,48), color(100,179,153), color(241,199,169), "MBDTF"],*/
        [color(17, 21, 9), color(85, 107, 47), color(85, 107, 47), color(34, 43, 19), "Olive"]
        ])
    }
    _hsl = (i, offset=0, alpha=100, l=null) => {
        const c = this.colors[i]
        const o = R.random_num(-offset, offset)
        l = l == null ? lightness(c) : l
        return c//color(hue(c) + o, saturation(c) + o, l, alpha)
    }

    background = () => this._hsl(0)
    rays = () => this._hsl(1)
    stars = () => this._hsl(2)
    dust = () => this._hsl(3)
    name = () => this._hsl(4)
}


function drawFrame(eps, strokeW, c) {
    push()
    noFill()
    stroke(c)
    let sw = 1

    for (let s = sw; s<strokeW; s++) {
        strokeWeight(sw)
        rect(-W/2 + eps + s, -H/2+eps + s, W-2*(eps+s), H-2*(eps+s+1))
    }
    pop()
}



let P
function setup() {
    createCanvas(W, H, WEBGL)

    
    // colorMode(HSL, 360,100,100, 100)
    P = new Palette()
    background(P.background())
    B = new Background()
    B.render()

    strokeWeight(2)
    //                          PUT THIS IN AFTER DEBUGGING
    
    let raySpacingDegrees = R.random_int(1, 5)
    for (let i = 0; i<360; i+= raySpacingDegrees) {
        let rayTemp = new Ray(i);
        rayTemp.render();
    }
    
    
    let numStars = 70//R.random_int(0, 30);
    let thetaDeg; 
    let thetaNoise;
    if (starRange || starSpiral) {
        thetaDeg = R.random_num(0, 360)
        thetaNoise = R.random_num(10, 45)
        console.log("thetaDeg: ", thetaDeg);
        console.log("thetaNoise: ", thetaNoise);
    }
    //let maxDist = Math.max(W/2-x)
    for (let i = 0; i<numStars; i+= 1) {
        let xs; 
        let ys;
        if (starRange) {
            let ts = thetaDeg + R.random_num(-thetaNoise, thetaNoise);
            let ds = R.random_num(0,W)
            xs = Math.floor(x + ds * Math.cos(ts * Math.PI / 180));
            ys = Math.floor(y + ds * Math.sin(ts * Math.PI / 180));
            console.log("(xs, ys): ", xs, ys)
        }
        else if (starSpiral) {
            let ts = thetaDeg + R.random_num(-thetaNoise, thetaNoise);
            let ds = R.random_num(0,W)
            let spiralStrength = R.random_num(3, 8)
            xs = Math.floor(x + ds * Math.cos((ts+ds/spiralStrength) * Math.PI / 180));
            ys = Math.floor(y + ds * Math.sin((ts+ds/spiralStrength) * Math.PI / 180));
            console.log("(xs, ys): ", xs, ys)
        }
        else{
            xs = R.random_int(-W/2, W/2);
            ys = R.random_int(-H/2, H/2);
        }
        
        let dist = (xs-x)**2 + (ys-y)**2;
        //let rs = R.random_int(3, 200000/dist);
        
        let rs = dist/10000 + R.random_int(-dist, dist)/20000;
        //let rs = R.random_int(dist, 2*dist);
        if ((xs-x)**2 + (ys-y)**2 > (r+rs)**2) {
            let starTemp = new Star(xs, ys, rs, 3)
            starTemp.render()
        }
    }
    

    

    if (P.name() == 'Void' || P.name() == "Cream") {
        drawFrame(10, 5, color(0));
        drawFrame(4, 7, P.background());
        drawFrame(-1, 6, color(0));
    }
    else {
        drawFrame(10, 5, color(255));
        drawFrame(4, 7, P.background());
        drawFrame(-1, 6, color(255));
    }
}