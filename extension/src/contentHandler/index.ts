import commodity from "./commodity";
import ContextMenusHandler from "./ContextMenusHandler";
import TrackHandler from "./TrackHandler";

export default [
    new ContextMenusHandler(),
    new TrackHandler(),
    ...commodity,
];
