declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let rayDistance: ƒ.Vector3;
    let line: ƒ.Node;
    let cube: ƒ.Node;
    function start(_event: Event): Promise<void>;
    function hndPointerMove(_event: ƒ.EventPointer): void;
    function hndMousclick(_event: any): void;
}
declare namespace Script {
    import ƒAid = FudgeAid;
    let col: boolean;
    enum JOB {
        IDLE = 0,
        HOVERED1 = 1,
        HOVERED2 = 2,
        PLAYER1 = 3,
        PLAYER2 = 4
    }
    function change(_event: Event): Promise<void>;
    class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static actIdle;
        private static actHoverd1;
        private static actHoverd2;
        private static actPlayer1;
        private static actPlayer2;
        private hndEvent;
        private update;
    }
}
