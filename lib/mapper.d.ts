import { ContextPosition } from './context';
export declare class ComponentMapper {
    private pos;
    constructor(pos: ContextPosition);
    mapState(map: any): {
        [key: string]: () => any;
    };
    mapGetters(map: any): {
        [key: string]: () => any;
    };
    mapMutations(map: any): {
        [key: string]: (...args: any[]) => any;
    };
    mapActions(map: any): {
        [key: string]: (...args: any[]) => any;
    };
}
