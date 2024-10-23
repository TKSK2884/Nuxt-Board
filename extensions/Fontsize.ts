import { Extension } from "@tiptap/core";
import TextStyle from "@tiptap/extension-text-style";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (size: string) => ReturnType;
            unsetFontSize: () => ReturnType;
        };
    }
}

const FontSize = Extension.create({
    name: "fontSize",

    addOptions() {
        return {
            types: ["textStyle"],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) =>
                            element.style.fontSize.replace(/['"]+/g, ""),
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize:
                (size: string) =>
                ({ chain }) => {
                    return chain()
                        .setMark("textStyle", { fontSize: size })
                        .run();
                },
            unsetFontSize:
                () =>
                ({ chain }) => {
                    return chain()
                        .setMark("textStyle", { fontSize: null })
                        .removeEmptyTextStyle()
                        .run();
                },
        };
    },
});

export default FontSize;
