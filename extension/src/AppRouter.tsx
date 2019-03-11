import * as React from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import Home from "./components/Home";
import Initialization from "./components/Initialization";
import SavePassword from "./components/SavePassword";
import { getLanguage, getLocalMessage } from "./i18n";

export const AppRouter: React.StatelessComponent<{}> = () => {
    return (
        <IntlProvider locale={getLanguage()} messages={getLocalMessage(getLanguage())}>
            <BrowserRouter>
                <div>
                    <Redirect from="/" to="/home" />
                    <Route path="/init" component={Initialization} />
                    <Route path="/savepassword" component={SavePassword} />
                    <Route path="/home" component={Home} />
                </div>
            </BrowserRouter>
        </IntlProvider>
    );
};
