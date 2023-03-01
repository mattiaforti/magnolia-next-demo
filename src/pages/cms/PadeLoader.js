import React from "react";
import config from "../../../magnolia.config";
import {
    getLanguages,
    removeCurrentLanguage,
    getCurrentLanguage,
} from "./AppHelpers";

import { EditablePage } from "@magnolia/react-editor";
import { EditorContextHelper } from "@magnolia/react-editor";

const NODE_NAME = process.env.NEXT_PUBLIC_MGNL_APP_BASE;

class PageLoader extends React.Component {
    state = {};

    getPagePath = () => {
        const languages = getLanguages();
        const currentLanguage = getCurrentLanguage();

        console.log("pathname:" + window.location.pathname);
        console.log("nodeName:" + NODE_NAME);

        let path =
            NODE_NAME +
            window.location.pathname.replace(
                new RegExp("(.*" + process.env.NEXT_PUBLIC_APP_BASE + "|.html)", "g"),
                ""
            );

        console.log("path:" + path);

        if (currentLanguage !== languages[0]) {
            path = removeCurrentLanguage(path, currentLanguage);
            path += "?lang=" + currentLanguage;
        }

        return path;
    };

    loadPage = async () => {
        // Bail out if already loaded content.
        if (this.state.pathname === window.location.pathname) return;

        const apiBase = "localhost:8080";

        //const pagePath = this.getPagePath();
        const pagePath = this.props.pagePath ? this.props.pagePath : this.getPagePath()


        console.log("pagePath:" + pagePath);
        let fullContentPath =
            apiBase + process.env.NEXT_PUBLIC_MGNL_API_PAGES + pagePath;

        const pageResponse = await fetch(fullContentPath);
        const pageJson = await pageResponse.json();
        console.log("page content: ", pageJson);

        const templateId = pageJson["mgnl:template"];
        console.log("templateId:", templateId);

        debugger;

        let templateJson = null;
        if (EditorContextHelper.inEditor()) {
            const templateResponse = await fetch(
                apiBase + process.env.NEXT_PUBLIC_MGNL_API_TEMPLATES + "/" + templateId
            );
            templateJson = await templateResponse.json();
            console.log("definition:", templateJson);
        }

        this.setState({
            init: true,
            content: pageJson,
            templateDefinitions: templateJson,
            pathname: window.location.pathname,
        });
    };

    inEditorPreview() {
        const url = window.location.href;
        const inPreview = url.indexOf("mgnlPreview=true") > 0;
        console.log("inEditorPreview:" + inPreview);
        return EditorContextHelper.inEditor() && inPreview;
    }

    componentDidMount() {
        this.loadPage();
    }

    componentDidUpdate() {
        this.loadPage();
    }

    render() {
        if (this.state.init) {
            console.log("config:", config);

            return (
                <div>
                    <EditablePage
                        templateDefinitions={this.state.templateDefinitions || {}}
                        content={this.state.content}
                        config={config}
                    />
                </div>

            );
        }
    }
}

export const getServerSideProps = (context) => {
}

export default PageLoader;