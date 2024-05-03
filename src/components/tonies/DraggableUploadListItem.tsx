import {
    DeleteOutlined,
  } from "@ant-design/icons";
import { Typography } from "antd";
import React from 'react';
import { humanFileSize } from "../../util/humanFileSize";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MyUploadFile } from "../../util/encoder";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface DraggableUploadListItemProps {
    originNode: React.ReactElement<
      any,
      string | React.JSXElementConstructor<any>
    >;
    fileList: MyUploadFile<any>[];
    file: MyUploadFile<any>;
    onRemove: (file: MyUploadFile) => void;
    disabled: boolean;
  }

export const DraggableUploadListItem = ({
    originNode,
    fileList,
    file,
    onRemove,
    disabled,
  }: DraggableUploadListItemProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: file.uid,
    });

    const { t } = useTranslation();
  
    const draggingStyle: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: "move",
    };
  
    return (
      <div
        ref={setNodeRef}
        style={draggingStyle}
        className={isDragging ? "is-dragging" : ""}
        {...attributes}
        {...listeners}
      >
        <div className="ant-upload-list-item ant-upload-list-item-undefined">
          <div className="ant-upload-list-item-thumbnail ant-upload-list-item-file">
            <span role="img" aria-label="file" className="anticon anticon-file">
              {fileList.indexOf(file) + 1}.
            </span>
          </div>
          <span className="ant-upload-list-item-name" title={file.name}>
            <span className="">{file.name}</span>
            <br />
            <Text type="secondary">
              {humanFileSize(file.size ? file.size : -1)}
            </Text>
          </span>
          <span className="ant-upload-list-item-actions picture">
            <button
              title={t("tonies.encoder.removeFile")}
              type="button"
              className="ant-btn css-dev-only-do-not-override-1kuana8 ant-btn-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-action"
              onClick={() => onRemove(file)}
              disabled={disabled}
            >
              <span className="ant-btn-icon">
                <DeleteOutlined />
              </span>
            </button>
          </span>
        </div>
      </div>
    );
  };