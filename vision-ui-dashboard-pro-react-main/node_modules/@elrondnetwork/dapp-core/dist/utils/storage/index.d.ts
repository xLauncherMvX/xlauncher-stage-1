import * as local from './local';
import * as session from './session';
export declare const storage: {
    session: typeof session;
    local: typeof local;
};
export default storage;
