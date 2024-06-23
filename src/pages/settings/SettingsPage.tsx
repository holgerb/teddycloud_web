import React from "react";
import { Form, Alert } from "antd";
import { Link } from "react-router-dom"; // Import Link from React Router
import { useTranslation } from "react-i18next";
import {
    HiddenDesktop,
    StyledBreadcrumb,
    StyledContent,
    StyledLayout,
    StyledSider,
} from "../../components/StyledComponents";
import { SettingsSubNav } from "../../components/settings/SettingsSubNav";
import { OptionsList, TeddyCloudApi } from "../../api";
import { defaultAPIConfig } from "../../config/defaultApiConfig";
import { useEffect, useState } from "react";
import OptionItem from "../../components/settings/OptionItem";
import { Formik } from "formik";

const api = new TeddyCloudApi(defaultAPIConfig());

/** TODO: Create validation schema for all settings before submitting them to backend
const settingsValidationSchema = Yup.object().shape({
  test: Yup.string().required("Dies ist ein Pflichtfeld."),
  booleanToCheck: Yup.string()
    .required("Pflichtfeld.")
    .oneOf(["on"], "Muss true sein."),
});
 */

export const SettingsPage = () => {
    const { t } = useTranslation();
    const [options, setOptions] = useState<OptionsList | undefined>();

    useEffect(() => {
        const fetchOptions = async () => {
            const optionsRequest = (await api.apiGetIndexGet("")) as OptionsList;
            if (optionsRequest?.options?.length && optionsRequest?.options?.length > 0) {
                setOptions(optionsRequest);
            }
        };

        fetchOptions();
    }, []);

    return (
        <>
            <StyledSider>
                <SettingsSubNav />
            </StyledSider>
            <StyledLayout>
                <HiddenDesktop>
                    <SettingsSubNav />
                </HiddenDesktop>
                <StyledBreadcrumb
                    items={[{ title: t("home.navigationTitle") }, { title: t("settings.navigationTitle") }]}
                />
                <StyledContent>
                    <h1>{t(`settings.title`)}</h1>
                    <Alert
                        message={t("settings.information")}
                        description=<div>
                            {t("settings.hint")} <Link to="/tonieboxes">{t("settings.tonieboxes")}</Link>.
                        </div>
                        type="info"
                        showIcon
                    />
                    <Alert
                        message={t("settings.warning")}
                        description=<div>{t("settings.warningHint")}</div>
                        type="warning"
                        showIcon
                        style={{ margin: "8px 0" }}
                    />
                    <Formik
                        //validationSchema={settingsValidationSchema}
                        initialValues={{
                            test: "test",
                        }}
                        onSubmit={(values: any) => {
                            // nothing to submit because of field onchange
                        }}
                    >
                        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="horizontal">
                            {options?.options?.map((option, index, array) => {
                                const parts = option.iD.split(".");
                                const lastParts = array[index - 1] ? array[index - 1].iD.split(".") : [];
                                return (
                                    <React.Fragment key={index}>
                                        {parts.slice(0, -1).map((part, partIndex) => {
                                            if (lastParts[partIndex] !== part) {
                                                if (partIndex === 0) {
                                                    return (
                                                        <h3
                                                            style={{
                                                                marginLeft: `${partIndex * 20}px`,
                                                                marginBottom: "10px",
                                                            }}
                                                            key={`category-${part}`}
                                                        >
                                                            Category {part}
                                                        </h3>
                                                    );
                                                } else {
                                                    return (
                                                        <h4
                                                            style={{
                                                                marginLeft: `${partIndex * 10}px`,
                                                                marginTop: "10px",
                                                                marginBottom: "10px",
                                                            }}
                                                            key={`category-${part}`}
                                                        >
                                                            .{part}
                                                        </h4>
                                                    );
                                                }
                                            }
                                            return null;
                                        })}
                                        <OptionItem option={option} noOverlay={true} key={option.iD} />
                                    </React.Fragment>
                                );
                            })}
                        </Form>
                    </Formik>
                </StyledContent>
            </StyledLayout>
        </>
    );
};
