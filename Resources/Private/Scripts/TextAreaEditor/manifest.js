import manifest from "@neos-project/neos-ui-extensibility";
import TextAreaEditor from "./TextAreaEditor";

manifest("JvMTECH.AIToolkit:TextAreaEditor", {}, (globalRegistry) => {
    const editorsRegistry = globalRegistry.get("inspector").get("editors");
    editorsRegistry.set("JvMTECH.AIToolkit/TextAreaEditor", {
        component: TextAreaEditor,
    });
});
