namespace Maba {
    import ƒ = FudgeCore;


    export class Base extends ƒ.Node {
        constructor() {
            super("Base");
            
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("BaseMesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("BaseMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0.84, 0, 1)))));
            //this.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("Sound/LaserSound.mp3"), false,false));   
            this.mtxLocal.scale(ƒ.Vector3.ONE(2));         
        }

    }




}