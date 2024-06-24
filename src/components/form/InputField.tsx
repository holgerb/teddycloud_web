import { MouseEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";
import { useField } from "formik";
import FormItem from "antd/es/form/FormItem";
import { Input, InputProps, message, Checkbox } from "antd";
import { TeddyCloudApi } from "../../api";
import { defaultAPIConfig } from "../../config/defaultApiConfig";
import { SaveOutlined } from "@ant-design/icons";

type InputFieldProps = {
    name: string;
    label?: string;
    description?: string;
    overlayed?: boolean;
    overlayId?: string;
};

const InputField = (props: InputFieldProps & InputProps) => {
    const { t } = useTranslation();
    const { name, label, description, overlayed: initialOverlayed, overlayId, ...inputProps } = props;
    const [field, meta, helpers] = useField(name!);
    const [overlayed, setOverlayed] = useState(initialOverlayed); // State to track overlayed boolean

    const hasFeedback = !!(meta.touched && meta.error);
    const help = meta.touched && meta.error && t(meta.error);
    const validateStatus = meta.touched && meta.error ? "error" : undefined;

    const api = new TeddyCloudApi(defaultAPIConfig());

    const handleOverlayChange = (checked: boolean) => {
        const overlayRoute = `?overlay=${overlayId}`;
        const url = `${import.meta.env.VITE_APP_TEDDYCLOUD_API_URL}/api/settings/${
            checked ? "set" : "reset"
        }/${name}${overlayRoute}`;

        try {
            fetch(url, {
                method: "POST",
                body: checked ? field.value?.toString() || "" : "",
                headers: {
                    "Content-Type": "text/plain",
                },
            })
                .then(() => {
                    triggerWriteConfig();
                    if (!checked) {
                        // Fetch field value if checkbox is unchecked
                        fetchFieldValue();
                        message.success(t("settings.overlayDisabled"));
                    } else {
                        message.success(t("settings.overlayEnabled"));
                    }
                })
                .catch((error) => {
                    message.error(`Error while ${checked ? "saving" : "resetting"} config: ${error}`);
                });
        } catch (error) {
            message.error(`Error while sending data to server: ${error}`);
        }
    };

    const handleFieldSave: MouseEventHandler<HTMLSpanElement> = (event) => {
        const inputValue = field.value || ""; // Get input value from useField hook

        const triggerWriteConfig = async () => {
            await api.apiTriggerWriteConfigGet();
        };

        const overlayRoute = overlayed ? `?overlay=` + overlayId : ``;

        try {
            fetch(`${import.meta.env.VITE_APP_TEDDYCLOUD_API_URL}/api/settings/set/${name}${overlayRoute}`, {
                method: "POST",
                body: inputValue,
                headers: {
                    "Content-Type": "text/plain",
                },
            })
                .then(() => {
                    triggerWriteConfig();
                    message.success(t("settings.saved"));
                })
                .catch((e) => {
                    message.error("Error while sending data to file.");
                });
        } catch (e) {
            message.error("Error while sending data to server.");
        }

        helpers.setValue(inputValue);
    };

    const handleSaveIconClick: MouseEventHandler<HTMLSpanElement> = (event) => {
        handleFieldSave(event); // Call handleFieldSave when the icon is clicked
    };

    const fetchFieldValue = () => {
        try {
            fetch(`${import.meta.env.VITE_APP_TEDDYCLOUD_API_URL}/api/settings/get/${name}`)
                .then((response) => response.text())
                .then((value) => {
                    helpers.setValue(value);
                })
                .catch((error) => {
                    message.error(`Error fetching field value: ${error}`);
                });
        } catch (error) {
            message.error(`Error fetching field value: ${error}`);
        }
    };

    const triggerWriteConfig = async () => {
        try {
            await api.apiTriggerWriteConfigGet();
        } catch (error) {
            message.error("Error while saving config to file.");
        }
    };

    const addonAfter = [
        <SaveOutlined
            disabled={overlayed ? false : true}
            style={{ cursor: overlayed ? "pointer" : "default", margin: overlayed !== undefined ? "0 16px 0 0" : "0" }}
            onClick={handleSaveIconClick}
        />,
        overlayed === undefined ? (
            ""
        ) : (
            <Checkbox
                checked={overlayed}
                onChange={(e) => {
                    setOverlayed(e.target.checked);
                    handleOverlayChange(e.target.checked);
                }}
            >
                {t("settings.overlayed")}
            </Checkbox>
        ),
    ];

    return (
        <FormItem
            help={hasFeedback ? help : undefined}
            validateStatus={validateStatus}
            label={label}
            tooltip={description}
        >
            <Input
                {...inputProps}
                {...field}
                addonAfter={addonAfter}
                disabled={!overlayed && overlayed !== undefined} // Disable if overlayed is false
            />
        </FormItem>
    );
};

export { InputField };
