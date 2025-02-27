import React, {PureComponent} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { TextArea as TextAreaOriginal } from "@neos-project/react-ui-components";
import unescape from "lodash.unescape";
import { fetchWithErrorHandling } from "@neos-project/neos-ui-backend-connector";
import { neos } from "@neos-project/neos-ui-decorators";
import { selectors } from "@neos-project/neos-ui-redux-store";
import { default as GenerateButton } from "../Components/GenerateButton";
import Helpers from "../Common/Helpers";

@connect((state) => ({
    nodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state),
    documentNodePath: (((state || {}).cr || {}).nodes || {}).documentNode,
    transientValues: selectors.UI.Inspector.transientValues(state),
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get("i18n"),
}))
export default class TextArea extends PureComponent {
    static propTypes = {
        id: PropTypes.string,
        value: PropTypes.string,
        highlight: PropTypes.bool,
        commit: PropTypes.func.isRequired,
        options: PropTypes.object,
        validationErrors: PropTypes.array,
        i18nRegistry: PropTypes.object.isRequired,
    };

    static defaultOptions = {
        disabled: false,
        maxlength: null,
        readonly: false,
        placeholder: "",
        minRows: 2,
        maxRows: 24,
        expandedRows: 6,
    };

    state = {
        isBusy: false,
    };

    showMessage = (message) => {
        setTimeout(() => {
            alert(message);
        }, 50);
    };

    generateText = async (setButtonCompleteState, setButtonErrorState, resetButtonState) => {
        // if complete is not a function then set it to an empty function
        if (typeof setButtonCompleteState !== "function") {
            setButtonCompleteState = () => ({});
        }
        // if error is not a function then set it to an empty function
        if (typeof setButtonErrorState !== "function") {
            setButtonErrorState = () => ({});
        }
        // if reset is not a function then set it to an empty
        if (typeof resetButtonState !== "function") {
            resetButtonState = () => ({});
        }

        const { value, commit, options, nodeContextPath, documentNodePath, getNodeByContextPath, transientValues } = this.props;
        const documentNode = getNodeByContextPath(documentNodePath);
        const node = getNodeByContextPath(nodeContextPath);

        const promptVariables = options && options.promptVariables ? options.promptVariables : [];
        const modelHandler = options && options.modelHandler ? options.modelHandler : "textToText";
        const modelPreset = options && options.modelPreset ? options.modelPreset : "default";
        const promptTemplate = options && options.promptTemplate ? options.promptTemplate : "";
        const forceMaxLength = options && options.forceMaxLength ? options.forceMaxLength : 0;
        const forceMaxLengthAttempts = options && options.forceMaxLengthAttempts ? options.forceMaxLengthAttempts : 0;
        const forceMaxLengthCut = options && options.forceMaxLengthCut ? options.forceMaxLengthCut : "";
        const dummy = options && options.dummy ? options.dummy : false;
        const debug = options && options.debug ? options.debug : false;

        this.setState({ isBusy: true });

        try {
            const nodeUri = Helpers.getDocumentContentUrl(document.location, nodeContextPath);

            // Code examples:
            // inputContent = await Helpers.getDocumentContent(nodeUri);
            // assetIdentifier = Helpers.getPropertyValue(node, transientValues, assetPropertyName);

            fetchWithErrorHandling
                .withCsrfToken((csrfToken) => ({
                    url: "/ai-toolkit/execute/" + modelHandler,
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "X-Flow-Csrftoken": csrfToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        promptVariables: promptVariables,
                        modelPreset: modelPreset,
                        nodeContextPath: nodeContextPath,
                        nodeUri: nodeUri,
                        currentValue: value,
                        transientValues: transientValues,
                        promptTemplate: promptTemplate,
                        forceMaxLength: forceMaxLength,
                        forceMaxLengthAttempts: forceMaxLengthAttempts,
                        forceMaxLengthCut: forceMaxLengthCut,
                        dummy: dummy,
                        debug: debug,
                    }),
                }))
                .then((response) => response && response.json())
                .then((data) => {
                    if (data.status === false) {
                        this.showMessage("AI Toolkit - Error 1734687655:\n\nWrong status");
                        setButtonErrorState();
                        return;
                    }

                    if (debug && data.prompt) {
                        console.debug("prompt", data.prompt);
                    }

                    commit(data.newValue);
                    setButtonCompleteState();
                })
                .catch((error) => {
                    setButtonErrorState();
                    this.showMessage("AI Toolkit - Error 1733928796:\n\n" + error);
                })
                .finally(() => {
                    this.setState({ isBusy: false });
                });
        } catch (error) {
            this.showMessage("AI Toolkit - Error 1733928803:\n\n" + error);
            this.setState({ isBusy: false });
            setButtonErrorState();
        }
    };

    render() {
        const {id, value, commit, options, className, i18nRegistry} = this.props;

        const finalOptions = Object.assign({}, this.constructor.defaultOptions, options);
        const placeholder = finalOptions.placeholder && i18nRegistry.translate(unescape(finalOptions.placeholder));

        const showAiButton = !(finalOptions.readonly || finalOptions.disabled);

        return (
            <div>
                <div style={{ display: "flex", marginBottom: "0.3rem" }} className={className}>
                    <div style={{ flexGrow: 1 }}>
                        <TextAreaOriginal
                            id={id}
                            value={value === null ? '' : value}
                            className={className}
                            onChange={commit}
                            disabled={finalOptions.disabled}
                            maxLength={finalOptions.maxlength}
                            readOnly={finalOptions.readonly}
                            placeholder={placeholder}
                            minRows={finalOptions.minRows}
                            maxRows={finalOptions.maxRows}
                            expandedRows={finalOptions.expandedRows}
                        />
                    </div>
                </div>
                {showAiButton ? <GenerateButton onClick={this.generateText} /> : null}
            </div>
        );
    }
}
