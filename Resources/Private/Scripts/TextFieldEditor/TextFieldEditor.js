import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { TextInput, IconButton } from "@neos-project/react-ui-components";
import unescape from "lodash.unescape";
import { fetchWithErrorHandling } from "@neos-project/neos-ui-backend-connector";
import { neos } from "@neos-project/neos-ui-decorators";
import { selectors } from "@neos-project/neos-ui-redux-store";
import style from "./style.module.css";
import { default as GenerateButton } from "../Components/GenerateButton";
import Helpers from "../Common/Helpers";

const defaultOptions = {
    autoFocus: false,
    disabled: false,
    maxlength: null,
    readonly: false,
    buttonStyle: "slim",
};

const busySyncIconProps = {
    spin: true,
};

@connect((state) => ({
    nodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state),
    documentNodePath: (((state || {}).cr || {}).nodes || {}).documentNode,
    transientValues: selectors.UI.Inspector.transientValues(state),
}))
@neos((globalRegistry) => ({
    i18nRegistry: globalRegistry.get("i18n"),
}))
export default class TextField extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        commit: PropTypes.func.isRequired,
        options: PropTypes.object,
        onKeyPress: PropTypes.func,
        onEnterKey: PropTypes.func,
        id: PropTypes.string,

        i18nRegistry: PropTypes.object.isRequired,
    };

    static defaultProps = {
        options: {},
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
                    this.showMessage("AI Toolkit - Error 1733928796:\n\n" + error);
                    setButtonErrorState();
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
        const { id, value, className, commit, options, i18nRegistry, onKeyPress, onEnterKey } = this.props;

        const placeholder = options && options.placeholder && i18nRegistry.translate(unescape(options.placeholder));
        const finalOptions = Object.assign({}, defaultOptions, options);

        const showAiButton = !(finalOptions.readonly || finalOptions.disabled);

        return (
            <div>
                <div style={{ display: "flex", marginBottom: "0.3rem" }} className={className}>
                    <div style={{ flexGrow: 1 }}>
                        <TextInput
                            id={id}
                            autoFocus={finalOptions.autoFocus}
                            value={value}
                            onChange={commit}
                            placeholder={placeholder}
                            onKeyPress={onKeyPress}
                            onEnterKey={onEnterKey}
                            disabled={finalOptions.disabled || this.state.isBusy}
                            maxLength={finalOptions.maxlength}
                            readOnly={finalOptions.readonly}
                        />
                    </div>
                    {showAiButton && finalOptions.buttonStyle === "slim" ? (
                        <div style={{ flexGrow: 0 }}>
                            <IconButton
                                id="neos-UriPathSegmentEditor-sync"
                                size="regular"
                                icon="magic"
                                iconProps={this.state.isBusy ? busySyncIconProps : undefined}
                                onClick={this.generateText}
                                className={style.aiButton}
                                disabled={this.state.isBusy}
                                style="neutral"
                                hoverStyle="clean"
                                title={i18nRegistry.translate("JvMTECH.AIToolkit:Main:general.generate.cta")}
                            />
                        </div>
                    ) : null}
                </div>
                {showAiButton && finalOptions.buttonStyle !== "slim" ? (
                    <GenerateButton onClick={this.generateText} />
                ) : null}
            </div>
        );
    }
}
