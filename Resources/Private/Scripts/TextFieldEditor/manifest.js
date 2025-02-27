import manifest from "@neos-project/neos-ui-extensibility";
import TextFieldEditor from "./TextFieldEditor";

manifest("JvMTECH.AIToolkit:TextFieldEditor", {}, (globalRegistry) => {
    const editorsRegistry = globalRegistry.get("inspector").get("editors");
    editorsRegistry.set("JvMTECH.AIToolkit/TextFieldEditor", {
        component: TextFieldEditor,
    });
});
