namespace LaserLeague {
    import ƒ = FudgeCore;


    export class Agent extends ƒ.Node {
        constructor() {
            super("Agent");
            
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshSphere("agentmesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("agentmaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0.84, 0, 1)))));
            this.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("Sound/LaserSound.mp3"), false,false));
            //this.addComponent(new ƒ.ComponentAudioListener)
            this.mtxLocal.scale(ƒ.Vector3.ONE(.5));
            this.mtxLocal.translateY(0.5);
            console.log("testtest")
        }

    }




}