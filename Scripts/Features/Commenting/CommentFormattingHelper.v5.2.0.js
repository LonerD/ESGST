function loadCommentFormattingHelper(context) {
    var textAreas = context.querySelectorAll(`textarea[name='description']`);
    for (var i = 0, n = textAreas.length; i < n; ++i) {
        addCFHPanel(textAreas[i]);
    }
}

function addCFHPanel(Context) {
    var CFH, I, N;
    Context.insertAdjacentHTML("beforeBegin", "<div class=\"page__heading page_heading CFHPanel\"></div>");
    CFH = {
        Items: [{
            ID: "cfh_i",
            Name: "Italic",
            Icon: "fa-italic",
            Prefix: "*",
            Suffix: "*"
        }, {
            ID: "cfh_b",
            Name: "Bold",
            Icon: "fa-bold",
            Prefix: "**",
            Suffix: "**"
        }, {
            ID: "cfh_s",
            Name: "Spoiler",
            Icon: "fa-eye-slash",
            Prefix: "~",
            Suffix: "~"
        }, {
            ID: "cfh_st",
            Name: "Strikethrough",
            Icon: "fa-strikethrough",
            Prefix: "~~",
            Suffix: "~~"
        }, {
            ID: "cfh_h1",
            Name: "Heading 1",
            Icon: "fa-header",
            Text: "1",
            Prefix: "# "
        }, {
            ID: "cfh_h2",
            Name: "Heading 2",
            Icon: "fa-header",
            Text: "2",
            Prefix: "## "
        }, {
            ID: "cfh_h3",
            Name: "Heading 3",
            Icon: "fa-header",
            Text: "3",
            Prefix: "### "
        }, {
            ID: "cfh_bq",
            Name: "Blockquote",
            Icon: "fa-quote-left",
            Prefix: "> "
        }, {
            ID: "cfh_lb",
            Name: "Line Break",
            Icon: "fa-minus",
            Prefix: "\n---\n\n"
        }, {
            ID: "cfh_ol",
            Name: "Ordered List",
            Icon: "fa-list-ol",
            OrderedList: true
        }, {
            ID: "cfh_ul",
            Name: "Unordered List",
            Icon: "fa-list-ul",
            UnorderedList: true
        }, {
            ID: "cfh_ic",
            Name: "Inline Code",
            Icon: "fa-code",
            Prefix: "`",
            Suffix: "`"
        }, {
            ID: "cfh_lc",
            Name: "Line Code",
            Icon: "fa-code",
            SecondaryIcon: "fa-indent",
            Prefix: "    "
        }, {
            ID: "cfh_pc",
            Name: "Paragraph Code",
            Icon: "fa-code",
            SecondaryIcon: "fa-paragraph",
            Prefix: "```\n",
            Suffix: "\n```"
        }, {
            ID: "cfh_l",
            Name: "Link",
            Icon: "fa-globe",
            setPopout: function(Popout) {
                var URL, Title;
                Popout.innerHTML =
                    "URL: <input placeholder=\"http://www.example.com\" type=\"text\"/>" +
                    "Title: <input placeholder=\"Cat\" type=\"text\"/>" +
                    "<div class=\"form__saving-button btn_action white\">Add</div>";
                URL = Popout.firstElementChild;
                Title = URL.nextElementSibling;
                Title.nextElementSibling.addEventListener("click", function() {
                    wrapCFHLinkImage(CFH, Title.value, URL.value);
                    URL.value = ``;
                    Title.value = ``;
                    URL.focus();
                });
            },
            Callback: function(Popout) {
                var Value = CFH.TextArea.value;
                var Start = CFH.TextArea.selectionStart;
                var End = CFH.TextArea.selectionEnd;
                Popout.firstElementChild.nextElementSibling.value = Value.slice(Start, End);
                window.setTimeout(function() {
                    Popout.firstElementChild.focus();
                }, 0);
            }
        }, {
            ID: "cfh_img",
            Name: "Image",
            Icon: "fa-image",
            setPopout: function(Popout) {
                var URL, Title;
                Popout.innerHTML =
                    "URL: <input placeholder=\"http://www.example.com/image.jpg\" type=\"text\"/>" +
                    "Title: <input placeholder=\"Cats\" type=\"text\"/>" +
                    "<div class=\"form__saving-button btn_action white\">Add</div>";
                URL = Popout.firstElementChild;
                Title = URL.nextElementSibling;
                Title.nextElementSibling.addEventListener("click", function() {
                    wrapCFHLinkImage(CFH, Title.value, URL.value, true);
                    URL.value = ``;
                    Title.value = ``;
                    URL.focus();
                });
            },
            Callback: function(Popout) {
                var Value = CFH.TextArea.value;
                var Start = CFH.TextArea.selectionStart;
                var End = CFH.TextArea.selectionEnd;
                Popout.firstElementChild.nextElementSibling.value = Value.slice(Start, End);
                window.setTimeout(function() {
                    Popout.firstElementChild.focus();
                }, 0);
            }
        }, {
            ID: "cfh_t",
            Name: "Table",
            Icon: "fa-table",
            setPopup: function(Popup) {
                var Table, InsertRow, InsertColumn;
                Popout = Popup.Description;
                Popout.innerHTML =
                    "<table></table>" +
                    "<div class=\"form__saving-button btn_action white\">Insert Row</div>" +
                    "<div class=\"form__saving-button btn_action white\">Insert Column</div>" +
                    "<div class=\"form__saving-button btn_action white\">Add</div>";
                Table = Popout.firstElementChild;
                InsertRow = Table.nextElementSibling;
                InsertColumn = InsertRow.nextElementSibling;
                insertCFHTableRows(4, Table);
                insertCFHTableColumns(2, Table);
                InsertRow.addEventListener("click", function() {
                    insertCFHTableRows(1, Table);
                });
                InsertColumn.addEventListener("click", function() {
                    insertCFHTableColumns(1, Table);
                });
                InsertColumn.nextElementSibling.addEventListener("click", function() {
                    var Rows, I, NumRows, J, NumColumns, Value, Start, End;
                    Rows = Table.rows;
                    for (I = 1, NumRows = Rows.length; I < NumRows; ++I) {
                        for (J = 1, NumColumns = Rows[0].cells.length; J < NumColumns; ++J) {
                            if (!Rows[I].cells[J].firstElementChild.value) {
                                I = NumRows + 1;
                                J = NumColumns + 1;
                            }
                        }
                    }
                    if ((I <= NumRows) || ((I > NumRows) && window.confirm("Some cells are empty. This might lead to unexpected results. Are you sure you want to continue?"))) {
                        Value = "";
                        for (I = 1; I < NumRows; ++I) {
                            Value += "\n";
                            for (J = 1; J < NumColumns; ++J) {
                                Value += Rows[I].cells[J].firstElementChild.value + ((J < (NumColumns - 1)) ? " | " : "");
                            }
                        }
                        Value += "\n\n";
                        Start = CFH.TextArea.selectionStart;
                        End = CFH.TextArea.selectionEnd;
                        CFH.TextArea.value = CFH.TextArea.value.slice(0, Start) + Value + CFH.TextArea.value.slice(End);
                        CFH.TextArea.setSelectionRange(End + Value.length, End + Value.length);
                        CFH.TextArea.focus();
                        Popup.Close.click();
                    }
                });
            }
        }, {
            ID: "cfh_e",
            Name: "Emojis",
            Icon: "fa-smile-o",
            setPopout: function(Popout) {
                var Emojis;
                Popout.innerHTML =
                    "<div class=\"CFHEmojis\">" + GM_getValue("Emojis") + "</div>" +
                    "<div class=\"form__saving-button btn_action white\">Select Emojis</div>";
                Emojis = Popout.firstElementChild;
                setCFHEmojis(Emojis, CFH);

                Emojis.nextElementSibling.addEventListener("click", function() {
                    var Popup, I, N, Emoji, SavedEmojis;
                    Popup = createPopup(true);
                    Popup.Icon.classList.add("fa-smile-o");
                    Popup.Title.textContent = "Select emojis:";
                    Popup.Description.insertAdjacentHTML(
                        "afterBegin",
                        "<div class=\"CFHEmojis\"></div>" +
                        createDescription("Drag the emojis you want to use and drop them in the box below. Click on an emoji to remove it.") +
                        "<div class=\"global__image-outer-wrap page_heading_btn CFHEmojis\">" + GM_getValue("Emojis") + "</div>"
                    );
                    Emojis = Popup.Description.firstElementChild;
                    for (I = 0, N = CFH.Emojis.length; I < N; ++I) {
                        Emoji = CFH.Emojis[I].Emoji;
                        Emojis.insertAdjacentHTML("beforeEnd", "<span data-id=\"" + Emoji + "\" draggable=\"true\" title=\"" + CFH.Emojis[I].Title + "\">" + Emoji + "</span>");
                        Emojis.lastElementChild.addEventListener("dragstart", function(Event) {
                            Event.dataTransfer.setData("text", Event.currentTarget.getAttribute("data-id"));
                        });
                    }
                    SavedEmojis = Emojis.nextElementSibling.nextElementSibling;
                    for (I = 0, N = SavedEmojis.children.length; I < N; ++I) {
                        SavedEmojis.children[I].addEventListener("click", function(Event) {
                            Event.currentTarget.remove();
                            GM_setValue("Emojis", SavedEmojis.innerHTML);
                            Popup.reposition();
                        });
                    }
                    SavedEmojis.addEventListener("dragover", function(Event) {
                        Event.preventDefault();
                    });
                    SavedEmojis.addEventListener("drop", function(Event) {
                        var ID;
                        Event.preventDefault();
                        ID = Event.dataTransfer.getData("text").replace(/\\/g, "\\\\");
                        if (!SavedEmojis.querySelector("[data-id='" + ID + "']")) {
                            SavedEmojis.appendChild(document.querySelector("[data-id='" + ID + "']").cloneNode(true));
                            GM_setValue("Emojis", SavedEmojis.innerHTML);
                            Popup.reposition();
                            SavedEmojis.lastElementChild.addEventListener("click", function(Event) {
                                Event.currentTarget.remove();
                                GM_setValue("Emojis", SavedEmojis.innerHTML);
                                Popup.reposition();
                            });
                        }
                    });
                    Popup = Popup.popUp(function() {
                        Popout.classList.add("rhHidden");
                    });
                });
            },
            Callback: function(Popout) {
                var Emojis;
                Emojis = Popout.firstElementChild;
                Emojis.innerHTML = GM_getValue("Emojis");
                setCFHEmojis(Emojis, CFH);
            }
        }, {
            Name: "Automatic Links / Images Paste Formatting",
            Icon: "fa-paste",
            Callback: function(Context) {
                CFH.ALIPF = Context.firstElementChild;
                setCFHALIPF(CFH, GM_getValue("CFH_ALIPF"));
            },
            OnClick: function() {
                setCFHALIPF(CFH);
            }
        }, {
            ID: "cfh_eg",
            Name: "Exclusive Giveaway",
            Icon: "fa-star",
            setPopout: function(Popout) {
                var Code;
                Popout.innerHTML =
                    "Giveaway Code: <input placeholder=\"XXXXX\" type=\"text\"/>" +
                    "<div class=\"form__saving-button btn_action white\">Add</div>";
                Code = Popout.firstElementChild;
                Code.nextElementSibling.addEventListener("click", function() {
                    var encodedCode = encodeGiveawayCode(Code.value);
                    wrapCFHLinkImage(CFH, ``, `ESGST-${encodedCode}`);
                    Code.value = ``;
                    Code.focus();
                });
            },
            Callback: function(Popout) {
                var Value = CFH.TextArea.value;
                var Start = CFH.TextArea.selectionStart;
                var End = CFH.TextArea.selectionEnd;
                Popout.firstElementChild.nextElementSibling.value = Value.slice(Start, End);
                window.setTimeout(function() {
                    Popout.firstElementChild.focus();
                }, 0);
            }
        }],
        Panel: Context.previousElementSibling,
        TextArea: Context,
        Emojis: [ //Top emojis credit to https://greasyfork.org/scripts/21607-steamgifts-comment-formatting
            {
                Emoji: "&#xAF;&#92;&#92;&#95;&#40;&#x30C4;&#41;&#95;&#47;&#xAF;",
                Title: ""
            }, {
                Emoji: "&#40; &#x361;&#xB0; &#x35C;&#x296; &#x361;&#xB0;&#41;",
                Title: ""
            }, {
                Emoji: "&#40; &#x361;&#x2299; &#x35C;&#x296; &#x361;&#x2299;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x30CE;&#xCA0;&#x76CA;&#xCA0;&#41;&#x30CE;",
                Title: ""
            }, {
                Emoji: "&#40;&#x256F;&#xB0;&#x25A1;&#xB0;&#xFF09;&#x256F;&#xFE35; &#x253B;&#x2501;&#x253B;",
                Title: ""
            }, {
                Emoji: "&#x252C;&#x2500;&#x252C;&#x30CE;&#40; &#xBA; &#95; &#xBA;&#x30CE;&#41;",
                Title: ""
            }, {
                Emoji: "&#x10DA;&#40;&#xCA0;&#x76CA;&#xCA0;&#x10DA;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x25D5;&#x203F;-&#41;&#x270C;",
                Title: ""
            }, {
                Emoji: "&#40;&#xFF61;&#x25D5;&#x203F;&#x25D5;&#xFF61;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x25D1;&#x203F;&#x25D0;&#41;",
                Title: ""
            }, {
                Emoji: "&#x25D4;&#95;&#x25D4;",
                Title: ""
            }, {
                Emoji: "&#40;&#x2022;&#x203F;&#x2022;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#xCA0;&#95;&#xCA0;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#xAC;&#xFF64;&#xAC;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x2500;&#x203F;&#x203F;&#x2500;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#xCA5;&#xFE4F;&#xCA5;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#xCA5;&#x2038;&#xCA5;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x2310;&#x25A0;&#95;&#x25A0;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#x25B0;&#x2D8;&#x25E1;&#x2D8;&#x25B0;&#41;",
                Title: ""
            }, {
                Emoji: "&#x4E41;&#40; &#x25D4; &#xC6A;&#x25D4;&#41;&#x310F;",
                Title: ""
            }, {
                Emoji: "&#40;&#xE07; &#x360;&#xB0; &#x35F;&#x296; &#x361;&#xB0;&#41;&#xE07;",
                Title: ""
            }, {
                Emoji: "&#x3B6;&#xF3C;&#x19F;&#x346;&#x644;&#x35C;&#x19F;&#x346;&#xF3D;&#x1D98;",
                Title: ""
            }, {
                Emoji: "&#x295;&#x2022;&#x1D25;&#x2022;&#x294;",
                Title: ""
            }, {
                Emoji: "&#40; &#x35D;&#xB0; &#x35C;&#x296;&#x361;&#xB0;&#41;",
                Title: ""
            }, {
                Emoji: "&#40;&#47;&#xFF9F;&#x414;&#xFF9F;&#41;&#47;",
                Title: ""
            }, {
                Emoji: "&#xB67;&#xF3C;&#xCA0;&#x76CA;&#xCA0;&#xF3D;&#xB68;",
                Title: ""
            }, {
                Emoji: "&#40;&#xE07; &#x2022;&#x300;&#95;&#x2022;&#x301;&#41;&#xE07;",
                Title: ""
            }, {
                Emoji: "&#x1F600",
                Title: "Grinning Face"
            }, {
                Emoji: "&#x1F601",
                Title: "Grinning Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F602",
                Title: "Face With Tears Of Joy"
            }, {
                Emoji: "&#x1F923",
                Title: "Rolling On The Floor Laughing"
            }, {
                Emoji: "&#x1F603",
                Title: "Smiling Face With Open Mouth"
            }, {
                Emoji: "&#x1F604",
                Title: "Smiling Face With Open Mouth & Smiling Eyes"
            }, {
                Emoji: "&#x1F605",
                Title: "Smiling Face With Open Mouth & Cold Sweat"
            }, {
                Emoji: "&#x1F606",
                Title: "Smiling Face With Open Mouth & Closed Eyes"
            }, {
                Emoji: "&#x1F609",
                Title: "Winking Face"
            }, {
                Emoji: "&#x1F60A",
                Title: "Smiling Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F60B",
                Title: "Face Savouring Delicious Food"
            }, {
                Emoji: "&#x1F60E",
                Title: "Smiling Face With Sunglasses"
            }, {
                Emoji: "&#x1F60D",
                Title: "Smiling Face With Heart-Eyes"
            }, {
                Emoji: "&#x1F618",
                Title: "Face Blowing A Kiss"
            }, {
                Emoji: "&#x1F617",
                Title: "Kissing Face"
            }, {
                Emoji: "&#x1F619",
                Title: "Kissing Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F61A",
                Title: "Kissing Face With Closed Eyes"
            }, {
                Emoji: "&#x263A",
                Title: "Smiling Face"
            }, {
                Emoji: "&#x1F642",
                Title: "Slightly Smiling Face"
            }, {
                Emoji: "&#x1F917",
                Title: "Hugging Face"
            }, {
                Emoji: "&#x1F914",
                Title: "Thinking Face"
            }, {
                Emoji: "&#x1F610",
                Title: "Neutral Face"
            }, {
                Emoji: "&#x1F611",
                Title: "Expressionless Face"
            }, {
                Emoji: "&#x1F636",
                Title: "Face Without Mouth"
            }, {
                Emoji: "&#x1F644",
                Title: "Face With Rolling Eyes"
            }, {
                Emoji: "&#x1F60F",
                Title: "Smirking Face"
            }, {
                Emoji: "&#x1F623",
                Title: "Persevering Face"
            }, {
                Emoji: "&#x1F625",
                Title: "Disappointed But Relieved Face"
            }, {
                Emoji: "&#x1F62E",
                Title: "Face With Open Mouth"
            }, {
                Emoji: "&#x1F910",
                Title: "Zipper-Mouth Face"
            }, {
                Emoji: "&#x1F62F",
                Title: "Hushed Face"
            }, {
                Emoji: "&#x1F62A",
                Title: "Sleepy Face"
            }, {
                Emoji: "&#x1F62B",
                Title: "Tired Face"
            }, {
                Emoji: "&#x1F634",
                Title: "Sleeping Face"
            }, {
                Emoji: "&#x1F60C",
                Title: "Relieved Face"
            }, {
                Emoji: "&#x1F913",
                Title: "Nerd Face"
            }, {
                Emoji: "&#x1F61B",
                Title: "Face With Stuck-Out Tongue"
            }, {
                Emoji: "&#x1F61C",
                Title: "Face With Stuck-Out Tongue & Winking Eye"
            }, {
                Emoji: "&#x1F61D",
                Title: "Face With Stuck-Out Tongue & Closed Eyes"
            }, {
                Emoji: "&#x1F924",
                Title: "Drooling Face"
            }, {
                Emoji: "&#x1F612",
                Title: "Unamused Face"
            }, {
                Emoji: "&#x1F613",
                Title: "Face With Cold Sweat"
            }, {
                Emoji: "&#x1F614",
                Title: "Pensive Face"
            }, {
                Emoji: "&#x1F615",
                Title: "Confused Face"
            }, {
                Emoji: "&#x1F643",
                Title: "Upside-Down Face"
            }, {
                Emoji: "&#x1F911",
                Title: "Money-Mouth Face"
            }, {
                Emoji: "&#x1F632",
                Title: "Astonished Face"
            }, {
                Emoji: "&#x2639",
                Title: "Frowning Face"
            }, {
                Emoji: "&#x1F641",
                Title: "Slightly Frowning Face"
            }, {
                Emoji: "&#x1F616",
                Title: "Confounded Face"
            }, {
                Emoji: "&#x1F61E",
                Title: "Disappointed Face"
            }, {
                Emoji: "&#x1F61F",
                Title: "Worried Face"
            }, {
                Emoji: "&#x1F624",
                Title: "Face With Steam From Nose"
            }, {
                Emoji: "&#x1F622",
                Title: "Crying Face"
            }, {
                Emoji: "&#x1F62D",
                Title: "Loudly Crying Face"
            }, {
                Emoji: "&#x1F626",
                Title: "Frowning Face With Open Mouth"
            }, {
                Emoji: "&#x1F627",
                Title: "Anguished Face"
            }, {
                Emoji: "&#x1F628",
                Title: "Fearful Face"
            }, {
                Emoji: "&#x1F629",
                Title: "Weary Face"
            }, {
                Emoji: "&#x1F62C",
                Title: "Grimacing Face"
            }, {
                Emoji: "&#x1F630",
                Title: "Face With Open Mouth & Cold Sweat"
            }, {
                Emoji: "&#x1F631",
                Title: "Face Screaming In Fear"
            }, {
                Emoji: "&#x1F633",
                Title: "Flushed Face"
            }, {
                Emoji: "&#x1F635",
                Title: "Dizzy Face"
            }, {
                Emoji: "&#x1F621",
                Title: "Pouting Face"
            }, {
                Emoji: "&#x1F620",
                Title: "Angry Face"
            }, {
                Emoji: "&#x1F607",
                Title: "Smiling Face With Halo"
            }, {
                Emoji: "&#x1F920",
                Title: "Cowboy Hat Face"
            }, {
                Emoji: "&#x1F921",
                Title: "Clown Face"
            }, {
                Emoji: "&#x1F925",
                Title: "Lying Face"
            }, {
                Emoji: "&#x1F637",
                Title: "Face With Medical Mask"
            }, {
                Emoji: "&#x1F912",
                Title: "Face With Thermometer"
            }, {
                Emoji: "&#x1F915",
                Title: "Face With Head-Bandage"
            }, {
                Emoji: "&#x1F922",
                Title: "Nauseated Face"
            }, {
                Emoji: "&#x1F927",
                Title: "Sneezing Face"
            }, {
                Emoji: "&#x1F608",
                Title: "Smiling Face With Horns"
            }, {
                Emoji: "&#x1F47F",
                Title: "Angry Face With Horns"
            }, {
                Emoji: "&#x1F479",
                Title: "Ogre"
            }, {
                Emoji: "&#x1F47A",
                Title: "Goblin"
            }, {
                Emoji: "&#x1F480",
                Title: "Skull"
            }, {
                Emoji: "&#x2620",
                Title: "Skull And Crossbones"
            }, {
                Emoji: "&#x1F47B",
                Title: "Ghost"
            }, {
                Emoji: "&#x1F47D",
                Title: "Alien"
            }, {
                Emoji: "&#x1F47E",
                Title: "Alien Monster"
            }, {
                Emoji: "&#x1F916",
                Title: "Robot Face"
            }, {
                Emoji: "&#x1F4A9",
                Title: "Pile Of Poo"
            }, {
                Emoji: "&#x1F63A",
                Title: "Smiling Cat Face With Open Mouth"
            }, {
                Emoji: "&#x1F638",
                Title: "Grinning Cat Face With Smiling Eyes"
            }, {
                Emoji: "&#x1F639",
                Title: "Cat Face With Tears Of Joy"
            }, {
                Emoji: "&#x1F63B",
                Title: "Smiling Cat Face With Heart-Eyes"
            }, {
                Emoji: "&#x1F63C",
                Title: "Cat Face With Wry Smile"
            }, {
                Emoji: "&#x1F63D",
                Title: "Kissing Cat Face With Closed Eyes"
            }, {
                Emoji: "&#x1F640",
                Title: "Weary Cat Face"
            }, {
                Emoji: "&#x1F63F",
                Title: "Crying Cat Face"
            }, {
                Emoji: "&#x1F63E",
                Title: "Pouting Cat Face"
            }, {
                Emoji: "&#x1F648",
                Title: "See-No-Evil Monkey"
            }, {
                Emoji: "&#x1F649",
                Title: "Hear-No-Evil Monkey"
            }, {
                Emoji: "&#x1F64A",
                Title: "Speak-No-Evil Monkey"
            }, {
                Emoji: "&#x1F466",
                Title: "Boy"
            }, {
                Emoji: "&#x1F466&#x1F3FB",
                Title: "Boy: Light Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FC",
                Title: "Boy: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FD",
                Title: "Boy: Medium Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FE",
                Title: "Boy: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F466&#x1F3FF",
                Title: "Boy: Dark Skin Tone"
            }, {
                Emoji: "&#x1F467",
                Title: "Girl"
            }, {
                Emoji: "&#x1F467&#x1F3FB",
                Title: "Girl: Light Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FC",
                Title: "Girl: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FD",
                Title: "Girl: Medium Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FE",
                Title: "Girl: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F467&#x1F3FF",
                Title: "Girl: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468",
                Title: "Man"
            }, {
                Emoji: "&#x1F468&#x1F3FB",
                Title: "Man: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC",
                Title: "Man: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD",
                Title: "Man: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE",
                Title: "Man: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF",
                Title: "Man: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469",
                Title: "Woman"
            }, {
                Emoji: "&#x1F469&#x1F3FB",
                Title: "Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC",
                Title: "Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD",
                Title: "Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE",
                Title: "Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF",
                Title: "Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F474",
                Title: "Old Man"
            }, {
                Emoji: "&#x1F474&#x1F3FB",
                Title: "Old Man: Light Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FC",
                Title: "Old Man: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FD",
                Title: "Old Man: Medium Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FE",
                Title: "Old Man: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F474&#x1F3FF",
                Title: "Old Man: Dark Skin Tone"
            }, {
                Emoji: "&#x1F475",
                Title: "Old Woman"
            }, {
                Emoji: "&#x1F475&#x1F3FB",
                Title: "Old Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FC",
                Title: "Old Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FD",
                Title: "Old Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FE",
                Title: "Old Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F475&#x1F3FF",
                Title: "Old Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F476",
                Title: "Baby"
            }, {
                Emoji: "&#x1F476&#x1F3FB",
                Title: "Baby: Light Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FC",
                Title: "Baby: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FD",
                Title: "Baby: Medium Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FE",
                Title: "Baby: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F476&#x1F3FF",
                Title: "Baby: Dark Skin Tone"
            }, {
                Emoji: "&#x1F47C",
                Title: "Baby Angel"
            }, {
                Emoji: "&#x1F47C&#x1F3FB",
                Title: "Baby Angel: Light Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FC",
                Title: "Baby Angel: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FD",
                Title: "Baby Angel: Medium Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FE",
                Title: "Baby Angel: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F47C&#x1F3FF",
                Title: "Baby Angel: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x2695&#xFE0F",
                Title: "Man Health Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x2695&#xFE0F",
                Title: "Woman Health Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F393",
                Title: "Man Student"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F393",
                Title: "Man Student: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F393",
                Title: "Man Student: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F393",
                Title: "Man Student: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F393",
                Title: "Man Student: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F393",
                Title: "Man Student: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F393",
                Title: "Woman Student"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F393",
                Title: "Woman Student: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F393",
                Title: "Woman Student: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F393",
                Title: "Woman Student: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F393",
                Title: "Woman Student: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F393",
                Title: "Woman Student: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3EB",
                Title: "Man Teacher"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3EB",
                Title: "Man Teacher: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3EB",
                Title: "Man Teacher: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3EB",
                Title: "Man Teacher: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3EB",
                Title: "Man Teacher: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3EB",
                Title: "Man Teacher: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3EB",
                Title: "Woman Teacher"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3EB",
                Title: "Woman Teacher: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3EB",
                Title: "Woman Teacher: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3EB",
                Title: "Woman Teacher: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3EB",
                Title: "Woman Teacher: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3EB",
                Title: "Woman Teacher: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x2696&#xFE0F",
                Title: "Man Judge"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x2696&#xFE0F",
                Title: "Man Judge: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x2696&#xFE0F",
                Title: "Woman Judge: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F33E",
                Title: "Man Farmer"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F33E",
                Title: "Man Farmer: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F33E",
                Title: "Man Farmer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F33E",
                Title: "Man Farmer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F33E",
                Title: "Man Farmer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F33E",
                Title: "Man Farmer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F33E",
                Title: "Woman Farmer"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F33E",
                Title: "Woman Farmer: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F33E",
                Title: "Woman Farmer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F33E",
                Title: "Woman Farmer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F33E",
                Title: "Woman Farmer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F33E",
                Title: "Woman Farmer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F373",
                Title: "Man Cook"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F373",
                Title: "Man Cook: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F373",
                Title: "Man Cook: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F373",
                Title: "Man Cook: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F373",
                Title: "Man Cook: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F373",
                Title: "Man Cook: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F373",
                Title: "Woman Cook"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F373",
                Title: "Woman Cook: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F373",
                Title: "Woman Cook: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F373",
                Title: "Woman Cook: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F373",
                Title: "Woman Cook: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F373",
                Title: "Woman Cook: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F527",
                Title: "Man Mechanic"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F527",
                Title: "Man Mechanic: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F527",
                Title: "Man Mechanic: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F527",
                Title: "Man Mechanic: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F527",
                Title: "Man Mechanic: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F527",
                Title: "Man Mechanic: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F527",
                Title: "Woman Mechanic"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F527",
                Title: "Woman Mechanic: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F527",
                Title: "Woman Mechanic: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F527",
                Title: "Woman Mechanic: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F527",
                Title: "Woman Mechanic: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F527",
                Title: "Woman Mechanic: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3ED",
                Title: "Man Factory Worker"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3ED",
                Title: "Man Factory Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3ED",
                Title: "Woman Factory Worker"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3ED",
                Title: "Woman Factory Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F4BC",
                Title: "Man Office Worker"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F4BC",
                Title: "Man Office Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F4BC",
                Title: "Man Office Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F4BC",
                Title: "Man Office Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F4BC",
                Title: "Man Office Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F4BC",
                Title: "Man Office Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F4BC",
                Title: "Woman Office Worker"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F4BC",
                Title: "Woman Office Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F52C",
                Title: "Man Scientist"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F52C",
                Title: "Man Scientist: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F52C",
                Title: "Man Scientist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F52C",
                Title: "Man Scientist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F52C",
                Title: "Man Scientist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F52C",
                Title: "Man Scientist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F52C",
                Title: "Woman Scientist"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F52C",
                Title: "Woman Scientist: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F52C",
                Title: "Woman Scientist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F52C",
                Title: "Woman Scientist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F52C",
                Title: "Woman Scientist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F52C",
                Title: "Woman Scientist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F4BB",
                Title: "Man Technologist"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F4BB",
                Title: "Man Technologist: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F4BB",
                Title: "Man Technologist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F4BB",
                Title: "Man Technologist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F4BB",
                Title: "Man Technologist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F4BB",
                Title: "Man Technologist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F4BB",
                Title: "Woman Technologist"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F4BB",
                Title: "Woman Technologist: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F4BB",
                Title: "Woman Technologist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F4BB",
                Title: "Woman Technologist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F4BB",
                Title: "Woman Technologist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F4BB",
                Title: "Woman Technologist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3A4",
                Title: "Man Singer"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3A4",
                Title: "Man Singer: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3A4",
                Title: "Man Singer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3A4",
                Title: "Man Singer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3A4",
                Title: "Man Singer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3A4",
                Title: "Man Singer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3A4",
                Title: "Woman Singer"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3A4",
                Title: "Woman Singer: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3A4",
                Title: "Woman Singer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3A4",
                Title: "Woman Singer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3A4",
                Title: "Woman Singer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3A4",
                Title: "Woman Singer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F3A8",
                Title: "Man Artist"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F3A8",
                Title: "Man Artist: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F3A8",
                Title: "Man Artist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F3A8",
                Title: "Man Artist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F3A8",
                Title: "Man Artist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F3A8",
                Title: "Man Artist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F3A8",
                Title: "Woman Artist"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F3A8",
                Title: "Woman Artist: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F3A8",
                Title: "Woman Artist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F3A8",
                Title: "Woman Artist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F3A8",
                Title: "Woman Artist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F3A8",
                Title: "Woman Artist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x2708&#xFE0F",
                Title: "Man Pilot: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x2708&#xFE0F",
                Title: "Woman Pilot: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F680",
                Title: "Man Astronaut"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F680",
                Title: "Man Astronaut: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F680",
                Title: "Man Astronaut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F680",
                Title: "Man Astronaut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F680",
                Title: "Man Astronaut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F680",
                Title: "Man Astronaut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F680",
                Title: "Woman Astronaut"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F680",
                Title: "Woman Astronaut: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F680",
                Title: "Woman Astronaut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F680",
                Title: "Woman Astronaut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F680",
                Title: "Woman Astronaut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F680",
                Title: "Woman Astronaut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F692",
                Title: "Man Firefighter"
            }, {
                Emoji: "&#x1F468&#x1F3FB&#x200D&#x1F692",
                Title: "Man Firefighter: Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FC&#x200D&#x1F692",
                Title: "Man Firefighter: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FD&#x200D&#x1F692",
                Title: "Man Firefighter: Medium Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FE&#x200D&#x1F692",
                Title: "Man Firefighter: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F468&#x1F3FF&#x200D&#x1F692",
                Title: "Man Firefighter: Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F692",
                Title: "Woman Firefighter"
            }, {
                Emoji: "&#x1F469&#x1F3FB&#x200D&#x1F692",
                Title: "Woman Firefighter: Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FC&#x200D&#x1F692",
                Title: "Woman Firefighter: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FD&#x200D&#x1F692",
                Title: "Woman Firefighter: Medium Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FE&#x200D&#x1F692",
                Title: "Woman Firefighter: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F469&#x1F3FF&#x200D&#x1F692",
                Title: "Woman Firefighter: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E",
                Title: "Police Officer"
            }, {
                Emoji: "&#x1F46E&#x1F3FB",
                Title: "Police Officer: Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FC",
                Title: "Police Officer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FD",
                Title: "Police Officer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FE",
                Title: "Police Officer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FF",
                Title: "Police Officer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer"
            }, {
                Emoji: "&#x1F46E&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Police Officer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer"
            }, {
                Emoji: "&#x1F46E&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Medium Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F46E&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Police Officer: Dark Skin Tone"
            }, {
                Emoji: "&#x1F575",
                Title: "Detective"
            }, {
                Emoji: "&#x1F575&#x1F3FB",
                Title: "Detective: Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FC",
                Title: "Detective: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FD",
                Title: "Detective: Medium Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FE",
                Title: "Detective: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FF",
                Title: "Detective: Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Detective"
            }, {
                Emoji: "&#x1F575&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Medium Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Detective: Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective"
            }, {
                Emoji: "&#x1F575&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Medium Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F575&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Detective: Dark Skin Tone"
            }, {
                Emoji: "&#x1F482",
                Title: "Guard"
            }, {
                Emoji: "&#x1F482&#x1F3FB",
                Title: "Guard: Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FC",
                Title: "Guard: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FD",
                Title: "Guard: Medium Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FE",
                Title: "Guard: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FF",
                Title: "Guard: Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x200D&#x2642&#xFE0F",
                Title: "Man Guard"
            }, {
                Emoji: "&#x1F482&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Medium Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Guard: Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard"
            }, {
                Emoji: "&#x1F482&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Medium Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F482&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Guard: Dark Skin Tone"
            }, {
                Emoji: "&#x1F477",
                Title: "Construction Worker"
            }, {
                Emoji: "&#x1F477&#x1F3FB",
                Title: "Construction Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FC",
                Title: "Construction Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FD",
                Title: "Construction Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FE",
                Title: "Construction Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FF",
                Title: "Construction Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker"
            }, {
                Emoji: "&#x1F477&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Construction Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker"
            }, {
                Emoji: "&#x1F477&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Medium Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F477&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Construction Worker: Dark Skin Tone"
            }, {
                Emoji: "&#x1F473",
                Title: "Person Wearing Turban"
            }, {
                Emoji: "&#x1F473&#x1F3FB",
                Title: "Person Wearing Turban: Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FC",
                Title: "Person Wearing Turban: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FD",
                Title: "Person Wearing Turban: Medium Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FE",
                Title: "Person Wearing Turban: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FF",
                Title: "Person Wearing Turban: Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban"
            }, {
                Emoji: "&#x1F473&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Medium Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Wearing Turban: Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban"
            }, {
                Emoji: "&#x1F473&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Medium Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F473&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Wearing Turban: Dark Skin Tone"
            }, {
                Emoji: "&#x1F471",
                Title: "Blond-Haired Person"
            }, {
                Emoji: "&#x1F471&#x1F3FB",
                Title: "Blond-Haired Person: Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FC",
                Title: "Blond-Haired Person: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FD",
                Title: "Blond-Haired Person: Medium Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FE",
                Title: "Blond-Haired Person: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FF",
                Title: "Blond-Haired Person: Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man"
            }, {
                Emoji: "&#x1F471&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Medium Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Blond-Haired Man: Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman"
            }, {
                Emoji: "&#x1F471&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F471&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Blond-Haired Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F385",
                Title: "Santa Claus"
            }, {
                Emoji: "&#x1F385&#x1F3FB",
                Title: "Santa Claus: Light Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FC",
                Title: "Santa Claus: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FD",
                Title: "Santa Claus: Medium Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FE",
                Title: "Santa Claus: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F385&#x1F3FF",
                Title: "Santa Claus: Dark Skin Tone"
            }, {
                Emoji: "&#x1F936",
                Title: "Mrs. Claus"
            }, {
                Emoji: "&#x1F936&#x1F3FB",
                Title: "Mrs. Claus: Light Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FC",
                Title: "Mrs. Claus: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FD",
                Title: "Mrs. Claus: Medium Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FE",
                Title: "Mrs. Claus: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F936&#x1F3FF",
                Title: "Mrs. Claus: Dark Skin Tone"
            }, {
                Emoji: "&#x1F478",
                Title: "Princess"
            }, {
                Emoji: "&#x1F478&#x1F3FB",
                Title: "Princess: Light Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FC",
                Title: "Princess: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FD",
                Title: "Princess: Medium Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FE",
                Title: "Princess: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F478&#x1F3FF",
                Title: "Princess: Dark Skin Tone"
            }, {
                Emoji: "&#x1F934",
                Title: "Prince"
            }, {
                Emoji: "&#x1F934&#x1F3FB",
                Title: "Prince: Light Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FC",
                Title: "Prince: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FD",
                Title: "Prince: Medium Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FE",
                Title: "Prince: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F934&#x1F3FF",
                Title: "Prince: Dark Skin Tone"
            }, {
                Emoji: "&#x1F470",
                Title: "Bride With Veil"
            }, {
                Emoji: "&#x1F470&#x1F3FB",
                Title: "Bride With Veil: Light Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FC",
                Title: "Bride With Veil: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FD",
                Title: "Bride With Veil: Medium Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FE",
                Title: "Bride With Veil: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F470&#x1F3FF",
                Title: "Bride With Veil: Dark Skin Tone"
            }, {
                Emoji: "&#x1F935",
                Title: "Man In Tuxedo"
            }, {
                Emoji: "&#x1F935&#x1F3FB",
                Title: "Man In Tuxedo: Light Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FC",
                Title: "Man In Tuxedo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FD",
                Title: "Man In Tuxedo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FE",
                Title: "Man In Tuxedo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F935&#x1F3FF",
                Title: "Man In Tuxedo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F930",
                Title: "Pregnant Woman"
            }, {
                Emoji: "&#x1F930&#x1F3FB",
                Title: "Pregnant Woman: Light Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FC",
                Title: "Pregnant Woman: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FD",
                Title: "Pregnant Woman: Medium Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FE",
                Title: "Pregnant Woman: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F930&#x1F3FF",
                Title: "Pregnant Woman: Dark Skin Tone"
            }, {
                Emoji: "&#x1F472",
                Title: "Man With Chinese Cap"
            }, {
                Emoji: "&#x1F472&#x1F3FB",
                Title: "Man With Chinese Cap: Light Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FC",
                Title: "Man With Chinese Cap: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FD",
                Title: "Man With Chinese Cap: Medium Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FE",
                Title: "Man With Chinese Cap: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F472&#x1F3FF",
                Title: "Man With Chinese Cap: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D",
                Title: "Person Frowning"
            }, {
                Emoji: "&#x1F64D&#x1F3FB",
                Title: "Person Frowning: Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FC",
                Title: "Person Frowning: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FD",
                Title: "Person Frowning: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FE",
                Title: "Person Frowning: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FF",
                Title: "Person Frowning: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning"
            }, {
                Emoji: "&#x1F64D&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Frowning: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning"
            }, {
                Emoji: "&#x1F64D&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64D&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Frowning: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E",
                Title: "Person Pouting"
            }, {
                Emoji: "&#x1F64E&#x1F3FB",
                Title: "Person Pouting: Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FC",
                Title: "Person Pouting: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FD",
                Title: "Person Pouting: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FE",
                Title: "Person Pouting: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FF",
                Title: "Person Pouting: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting"
            }, {
                Emoji: "&#x1F64E&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Pouting: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting"
            }, {
                Emoji: "&#x1F64E&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64E&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Pouting: Dark Skin Tone"
            }, {
                Emoji: "&#x1F645",
                Title: "Person Gesturing NO"
            }, {
                Emoji: "&#x1F645&#x1F3FB",
                Title: "Person Gesturing NO: Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FC",
                Title: "Person Gesturing NO: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FD",
                Title: "Person Gesturing NO: Medium Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FE",
                Title: "Person Gesturing NO: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FF",
                Title: "Person Gesturing NO: Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO"
            }, {
                Emoji: "&#x1F645&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Medium Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing NO: Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO"
            }, {
                Emoji: "&#x1F645&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Medium Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F645&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing NO: Dark Skin Tone"
            }, {
                Emoji: "&#x1F646",
                Title: "Person Gesturing OK"
            }, {
                Emoji: "&#x1F646&#x1F3FB",
                Title: "Person Gesturing OK: Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FC",
                Title: "Person Gesturing OK: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FD",
                Title: "Person Gesturing OK: Medium Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FE",
                Title: "Person Gesturing OK: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FF",
                Title: "Person Gesturing OK: Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK"
            }, {
                Emoji: "&#x1F646&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Medium Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Gesturing OK: Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK"
            }, {
                Emoji: "&#x1F646&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Medium Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F646&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Gesturing OK: Dark Skin Tone"
            }, {
                Emoji: "&#x1F481",
                Title: "Person Tipping Hand"
            }, {
                Emoji: "&#x1F481&#x1F3FB",
                Title: "Person Tipping Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FC",
                Title: "Person Tipping Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FD",
                Title: "Person Tipping Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FE",
                Title: "Person Tipping Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FF",
                Title: "Person Tipping Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand"
            }, {
                Emoji: "&#x1F481&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Tipping Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand"
            }, {
                Emoji: "&#x1F481&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F481&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Tipping Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B",
                Title: "Person Raising Hand"
            }, {
                Emoji: "&#x1F64B&#x1F3FB",
                Title: "Person Raising Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FC",
                Title: "Person Raising Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FD",
                Title: "Person Raising Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FE",
                Title: "Person Raising Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FF",
                Title: "Person Raising Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand"
            }, {
                Emoji: "&#x1F64B&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Raising Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand"
            }, {
                Emoji: "&#x1F64B&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64B&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Raising Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F647",
                Title: "Person Bowing"
            }, {
                Emoji: "&#x1F647&#x1F3FB",
                Title: "Person Bowing: Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FC",
                Title: "Person Bowing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FD",
                Title: "Person Bowing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FE",
                Title: "Person Bowing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FF",
                Title: "Person Bowing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing"
            }, {
                Emoji: "&#x1F647&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Bowing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing"
            }, {
                Emoji: "&#x1F647&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F647&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Bowing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F926",
                Title: "Person Facepalming"
            }, {
                Emoji: "&#x1F926&#x1F3FB",
                Title: "Person Facepalming: Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FC",
                Title: "Person Facepalming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FD",
                Title: "Person Facepalming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FE",
                Title: "Person Facepalming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FF",
                Title: "Person Facepalming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming"
            }, {
                Emoji: "&#x1F926&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Facepalming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming"
            }, {
                Emoji: "&#x1F926&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F926&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Facepalming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F937",
                Title: "Person Shrugging"
            }, {
                Emoji: "&#x1F937&#x1F3FB",
                Title: "Person Shrugging: Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FC",
                Title: "Person Shrugging: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FD",
                Title: "Person Shrugging: Medium Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FE",
                Title: "Person Shrugging: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FF",
                Title: "Person Shrugging: Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging"
            }, {
                Emoji: "&#x1F937&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Medium Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Shrugging: Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging"
            }, {
                Emoji: "&#x1F937&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Medium Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F937&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Shrugging: Dark Skin Tone"
            }, {
                Emoji: "&#x1F486",
                Title: "Person Getting Massage"
            }, {
                Emoji: "&#x1F486&#x1F3FB",
                Title: "Person Getting Massage: Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FC",
                Title: "Person Getting Massage: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FD",
                Title: "Person Getting Massage: Medium Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FE",
                Title: "Person Getting Massage: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FF",
                Title: "Person Getting Massage: Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage"
            }, {
                Emoji: "&#x1F486&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Medium Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Massage: Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage"
            }, {
                Emoji: "&#x1F486&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Medium Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F486&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Massage: Dark Skin Tone"
            }, {
                Emoji: "&#x1F487",
                Title: "Person Getting Haircut"
            }, {
                Emoji: "&#x1F487&#x1F3FB",
                Title: "Person Getting Haircut: Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FC",
                Title: "Person Getting Haircut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FD",
                Title: "Person Getting Haircut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FE",
                Title: "Person Getting Haircut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FF",
                Title: "Person Getting Haircut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut"
            }, {
                Emoji: "&#x1F487&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Getting Haircut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut"
            }, {
                Emoji: "&#x1F487&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Medium Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F487&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Getting Haircut: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6",
                Title: "Person Walking"
            }, {
                Emoji: "&#x1F6B6&#x1F3FB",
                Title: "Person Walking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FC",
                Title: "Person Walking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FD",
                Title: "Person Walking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FE",
                Title: "Person Walking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FF",
                Title: "Person Walking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x200D&#x2642&#xFE0F",
                Title: "Man Walking"
            }, {
                Emoji: "&#x1F6B6&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Walking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking"
            }, {
                Emoji: "&#x1F6B6&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B6&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Walking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3",
                Title: "Person Running"
            }, {
                Emoji: "&#x1F3C3&#x1F3FB",
                Title: "Person Running: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FC",
                Title: "Person Running: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FD",
                Title: "Person Running: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FE",
                Title: "Person Running: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FF",
                Title: "Person Running: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x200D&#x2642&#xFE0F",
                Title: "Man Running"
            }, {
                Emoji: "&#x1F3C3&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Running: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x200D&#x2640&#xFE0F",
                Title: "Woman Running"
            }, {
                Emoji: "&#x1F3C3&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C3&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Running: Dark Skin Tone"
            }, {
                Emoji: "&#x1F483",
                Title: "Woman Dancing"
            }, {
                Emoji: "&#x1F483&#x1F3FB",
                Title: "Woman Dancing: Light Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FC",
                Title: "Woman Dancing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FD",
                Title: "Woman Dancing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FE",
                Title: "Woman Dancing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F483&#x1F3FF",
                Title: "Woman Dancing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F57A",
                Title: "Man Dancing"
            }, {
                Emoji: "&#x1F57A&#x1F3FB",
                Title: "Man Dancing: Light Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FC",
                Title: "Man Dancing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FD",
                Title: "Man Dancing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FE",
                Title: "Man Dancing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F57A&#x1F3FF",
                Title: "Man Dancing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46F",
                Title: "People With Bunny Ears Partying"
            }, {
                Emoji: "&#x1F46F&#x200D&#x2642&#xFE0F",
                Title: "Men With Bunny Ears Partying"
            }, {
                Emoji: "&#x1F46F&#x200D&#x2640&#xFE0F",
                Title: "Women With Bunny Ears Partying"
            }, {
                Emoji: "&#x1F574",
                Title: "Man In Business Suit Levitating"
            }, {
                Emoji: "&#x1F574&#x1F3FB",
                Title: "Man In Business Suit Levitating: Light Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FC",
                Title: "Man In Business Suit Levitating: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FD",
                Title: "Man In Business Suit Levitating: Medium Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FE",
                Title: "Man In Business Suit Levitating: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F574&#x1F3FF",
                Title: "Man In Business Suit Levitating: Dark Skin Tone"
            }, {
                Emoji: "&#x1F5E3",
                Title: "Speaking Head"
            }, {
                Emoji: "&#x1F464",
                Title: "Bust In Silhouette"
            }, {
                Emoji: "&#x1F465",
                Title: "Busts In Silhouette"
            }, {
                Emoji: "&#x1F93A",
                Title: "Person Fencing"
            }, {
                Emoji: "&#x1F3C7",
                Title: "Horse Racing"
            }, {
                Emoji: "&#x1F3C7&#x1F3FB",
                Title: "Horse Racing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FC",
                Title: "Horse Racing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FD",
                Title: "Horse Racing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FE",
                Title: "Horse Racing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C7&#x1F3FF",
                Title: "Horse Racing: Dark Skin Tone"
            }, {
                Emoji: "&#x26F7",
                Title: "Skier"
            }, {
                Emoji: "&#x1F3C2",
                Title: "Snowboarder"
            }, {
                Emoji: "&#x1F3C2&#x1F3FB",
                Title: "Snowboarder: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FC",
                Title: "Snowboarder: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FD",
                Title: "Snowboarder: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FE",
                Title: "Snowboarder: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C2&#x1F3FF",
                Title: "Snowboarder: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC",
                Title: "Person Golfing"
            }, {
                Emoji: "&#x1F3CC&#x1F3FB",
                Title: "Person Golfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FC",
                Title: "Person Golfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FD",
                Title: "Person Golfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FE",
                Title: "Person Golfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FF",
                Title: "Person Golfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing"
            }, {
                Emoji: "&#x1F3CC&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Golfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing"
            }, {
                Emoji: "&#x1F3CC&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CC&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Golfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4",
                Title: "Person Surfing"
            }, {
                Emoji: "&#x1F3C4&#x1F3FB",
                Title: "Person Surfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FC",
                Title: "Person Surfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FD",
                Title: "Person Surfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FE",
                Title: "Person Surfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FF",
                Title: "Person Surfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing"
            }, {
                Emoji: "&#x1F3C4&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Surfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing"
            }, {
                Emoji: "&#x1F3C4&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3C4&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Surfing: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3",
                Title: "Person Rowing Boat"
            }, {
                Emoji: "&#x1F6A3&#x1F3FB",
                Title: "Person Rowing Boat: Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FC",
                Title: "Person Rowing Boat: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FD",
                Title: "Person Rowing Boat: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FE",
                Title: "Person Rowing Boat: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FF",
                Title: "Person Rowing Boat: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat"
            }, {
                Emoji: "&#x1F6A3&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Rowing Boat: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat"
            }, {
                Emoji: "&#x1F6A3&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6A3&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Rowing Boat: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA",
                Title: "Person Swimming"
            }, {
                Emoji: "&#x1F3CA&#x1F3FB",
                Title: "Person Swimming: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FC",
                Title: "Person Swimming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FD",
                Title: "Person Swimming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FE",
                Title: "Person Swimming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FF",
                Title: "Person Swimming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming"
            }, {
                Emoji: "&#x1F3CA&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Swimming: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming"
            }, {
                Emoji: "&#x1F3CA&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CA&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Swimming: Dark Skin Tone"
            }, {
                Emoji: "&#x26F9",
                Title: "Person Bouncing Ball"
            }, {
                Emoji: "&#x26F9&#x1F3FB",
                Title: "Person Bouncing Ball: Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FC",
                Title: "Person Bouncing Ball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FD",
                Title: "Person Bouncing Ball: Medium Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FE",
                Title: "Person Bouncing Ball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FF",
                Title: "Person Bouncing Ball: Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball"
            }, {
                Emoji: "&#x26F9&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Medium Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Bouncing Ball: Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball"
            }, {
                Emoji: "&#x26F9&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Medium Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x26F9&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Bouncing Ball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB",
                Title: "Person Lifting Weights"
            }, {
                Emoji: "&#x1F3CB&#x1F3FB",
                Title: "Person Lifting Weights: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FC",
                Title: "Person Lifting Weights: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FD",
                Title: "Person Lifting Weights: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FE",
                Title: "Person Lifting Weights: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FF",
                Title: "Person Lifting Weights: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#xFE0F&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights"
            }, {
                Emoji: "&#x1F3CB&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Lifting Weights: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#xFE0F&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights"
            }, {
                Emoji: "&#x1F3CB&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Medium Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CB&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Lifting Weights: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4",
                Title: "Person Biking"
            }, {
                Emoji: "&#x1F6B4&#x1F3FB",
                Title: "Person Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FC",
                Title: "Person Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FD",
                Title: "Person Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FE",
                Title: "Person Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FF",
                Title: "Person Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x200D&#x2642&#xFE0F",
                Title: "Man Biking"
            }, {
                Emoji: "&#x1F6B4&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking"
            }, {
                Emoji: "&#x1F6B4&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B4&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5",
                Title: "Person Mountain Biking"
            }, {
                Emoji: "&#x1F6B5&#x1F3FB",
                Title: "Person Mountain Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FC",
                Title: "Person Mountain Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FD",
                Title: "Person Mountain Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FE",
                Title: "Person Mountain Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FF",
                Title: "Person Mountain Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking"
            }, {
                Emoji: "&#x1F6B5&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Mountain Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking"
            }, {
                Emoji: "&#x1F6B5&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6B5&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Mountain Biking: Dark Skin Tone"
            }, {
                Emoji: "&#x1F3CE",
                Title: "Racing Car"
            }, {
                Emoji: "&#x1F3CD",
                Title: "Motorcycle"
            }, {
                Emoji: "&#x1F938",
                Title: "Person Cartwheeling"
            }, {
                Emoji: "&#x1F938&#x1F3FB",
                Title: "Person Cartwheeling: Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FC",
                Title: "Person Cartwheeling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FD",
                Title: "Person Cartwheeling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FE",
                Title: "Person Cartwheeling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FF",
                Title: "Person Cartwheeling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling"
            }, {
                Emoji: "&#x1F938&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Cartwheeling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling"
            }, {
                Emoji: "&#x1F938&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F938&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Cartwheeling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93C",
                Title: "People Wrestling"
            }, {
                Emoji: "&#x1F93C&#x200D&#x2642&#xFE0F",
                Title: "Men Wrestling"
            }, {
                Emoji: "&#x1F93C&#x200D&#x2640&#xFE0F",
                Title: "Women Wrestling"
            }, {
                Emoji: "&#x1F93D",
                Title: "Person Playing Water Polo"
            }, {
                Emoji: "&#x1F93D&#x1F3FB",
                Title: "Person Playing Water Polo: Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FC",
                Title: "Person Playing Water Polo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FD",
                Title: "Person Playing Water Polo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FE",
                Title: "Person Playing Water Polo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FF",
                Title: "Person Playing Water Polo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo"
            }, {
                Emoji: "&#x1F93D&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Water Polo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo"
            }, {
                Emoji: "&#x1F93D&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93D&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Water Polo: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E",
                Title: "Person Playing Handball"
            }, {
                Emoji: "&#x1F93E&#x1F3FB",
                Title: "Person Playing Handball: Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FC",
                Title: "Person Playing Handball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FD",
                Title: "Person Playing Handball: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FE",
                Title: "Person Playing Handball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FF",
                Title: "Person Playing Handball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball"
            }, {
                Emoji: "&#x1F93E&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Playing Handball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball"
            }, {
                Emoji: "&#x1F93E&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Medium Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F93E&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Playing Handball: Dark Skin Tone"
            }, {
                Emoji: "&#x1F939",
                Title: "Person Juggling"
            }, {
                Emoji: "&#x1F939&#x1F3FB",
                Title: "Person Juggling: Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FC",
                Title: "Person Juggling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FD",
                Title: "Person Juggling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FE",
                Title: "Person Juggling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FF",
                Title: "Person Juggling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling"
            }, {
                Emoji: "&#x1F939&#x1F3FB&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FC&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FD&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FE&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FF&#x200D&#x2642&#xFE0F",
                Title: "Man Juggling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling"
            }, {
                Emoji: "&#x1F939&#x1F3FB&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FC&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FD&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Medium Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FE&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F939&#x1F3FF&#x200D&#x2640&#xFE0F",
                Title: "Woman Juggling: Dark Skin Tone"
            }, {
                Emoji: "&#x1F46B",
                Title: "Man And Woman Holding Hands"
            }, {
                Emoji: "&#x1F46C",
                Title: "Two Men Holding Hands"
            }, {
                Emoji: "&#x1F46D",
                Title: "Two Women Holding Hands"
            }, {
                Emoji: "&#x1F48F",
                Title: "Kiss"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468",
                Title: "Kiss: Woman, Man"
            }, {
                Emoji: "&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F468",
                Title: "Kiss: Man, Man"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F48B&#x200D&#x1F469",
                Title: "Kiss: Woman, Woman"
            }, {
                Emoji: "&#x1F491",
                Title: "Couple With Heart"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F468",
                Title: "Couple With Heart: Woman, Man"
            }, {
                Emoji: "&#x1F468&#x200D&#x2764&#xFE0F&#x200D&#x1F468",
                Title: "Couple With Heart: Man, Man"
            }, {
                Emoji: "&#x1F469&#x200D&#x2764&#xFE0F&#x200D&#x1F469",
                Title: "Couple With Heart: Woman, Woman"
            }, {
                Emoji: "&#x1F46A",
                Title: "Family"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F466",
                Title: "Family: Man, Woman, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F467",
                Title: "Family: Man, Woman, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Man, Woman, Girl, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Man, Woman, Boy, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Man, Woman, Girl, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F466",
                Title: "Family: Man, Man, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F467",
                Title: "Family: Man, Man, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Man, Man, Girl, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Man, Man, Boy, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F468&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Man, Man, Girl, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F466",
                Title: "Family: Woman, Woman, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F467",
                Title: "Family: Woman, Woman, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Woman, Woman, Girl, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Woman, Woman, Boy, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Woman, Woman, Girl, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F466",
                Title: "Family: Man, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Man, Boy, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F467",
                Title: "Family: Man, Girl"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Man, Girl, Boy"
            }, {
                Emoji: "&#x1F468&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Man, Girl, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F466",
                Title: "Family: Woman, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F466&#x200D&#x1F466",
                Title: "Family: Woman, Boy, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F467",
                Title: "Family: Woman, Girl"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F467&#x200D&#x1F466",
                Title: "Family: Woman, Girl, Boy"
            }, {
                Emoji: "&#x1F469&#x200D&#x1F467&#x200D&#x1F467",
                Title: "Family: Woman, Girl, Girl"
            }, {
                Emoji: "&#x1F3FB",
                Title: "Light Skin Tone"
            }, {
                Emoji: "&#x1F3FC",
                Title: "Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F3FD",
                Title: "Medium Skin Tone"
            }, {
                Emoji: "&#x1F3FE",
                Title: "Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F3FF",
                Title: "Dark Skin Tone"
            }, {
                Emoji: "&#x1F4AA",
                Title: "Flexed Biceps"
            }, {
                Emoji: "&#x1F4AA&#x1F3FB",
                Title: "Flexed Biceps: Light Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FC",
                Title: "Flexed Biceps: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FD",
                Title: "Flexed Biceps: Medium Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FE",
                Title: "Flexed Biceps: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F4AA&#x1F3FF",
                Title: "Flexed Biceps: Dark Skin Tone"
            }, {
                Emoji: "&#x1F933",
                Title: "Selfie"
            }, {
                Emoji: "&#x1F933&#x1F3FB",
                Title: "Selfie: Light Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FC",
                Title: "Selfie: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FD",
                Title: "Selfie: Medium Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FE",
                Title: "Selfie: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F933&#x1F3FF",
                Title: "Selfie: Dark Skin Tone"
            }, {
                Emoji: "&#x1F448",
                Title: "Backhand Index Pointing Left"
            }, {
                Emoji: "&#x1F448&#x1F3FB",
                Title: "Backhand Index Pointing Left: Light Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FC",
                Title: "Backhand Index Pointing Left: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FD",
                Title: "Backhand Index Pointing Left: Medium Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FE",
                Title: "Backhand Index Pointing Left: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F448&#x1F3FF",
                Title: "Backhand Index Pointing Left: Dark Skin Tone"
            }, {
                Emoji: "&#x1F449",
                Title: "Backhand Index Pointing Right"
            }, {
                Emoji: "&#x1F449&#x1F3FB",
                Title: "Backhand Index Pointing Right: Light Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FC",
                Title: "Backhand Index Pointing Right: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FD",
                Title: "Backhand Index Pointing Right: Medium Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FE",
                Title: "Backhand Index Pointing Right: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F449&#x1F3FF",
                Title: "Backhand Index Pointing Right: Dark Skin Tone"
            }, {
                Emoji: "&#x261D",
                Title: "Index Pointing Up"
            }, {
                Emoji: "&#x261D&#x1F3FB",
                Title: "Index Pointing Up: Light Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FC",
                Title: "Index Pointing Up: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FD",
                Title: "Index Pointing Up: Medium Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FE",
                Title: "Index Pointing Up: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x261D&#x1F3FF",
                Title: "Index Pointing Up: Dark Skin Tone"
            }, {
                Emoji: "&#x1F446",
                Title: "Backhand Index Pointing Up"
            }, {
                Emoji: "&#x1F446&#x1F3FB",
                Title: "Backhand Index Pointing Up: Light Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FC",
                Title: "Backhand Index Pointing Up: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FD",
                Title: "Backhand Index Pointing Up: Medium Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FE",
                Title: "Backhand Index Pointing Up: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F446&#x1F3FF",
                Title: "Backhand Index Pointing Up: Dark Skin Tone"
            }, {
                Emoji: "&#x1F595",
                Title: "Middle Finger"
            }, {
                Emoji: "&#x1F595&#x1F3FB",
                Title: "Middle Finger: Light Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FC",
                Title: "Middle Finger: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FD",
                Title: "Middle Finger: Medium Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FE",
                Title: "Middle Finger: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F595&#x1F3FF",
                Title: "Middle Finger: Dark Skin Tone"
            }, {
                Emoji: "&#x1F447",
                Title: "Backhand Index Pointing Down"
            }, {
                Emoji: "&#x1F447&#x1F3FB",
                Title: "Backhand Index Pointing Down: Light Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FC",
                Title: "Backhand Index Pointing Down: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FD",
                Title: "Backhand Index Pointing Down: Medium Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FE",
                Title: "Backhand Index Pointing Down: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F447&#x1F3FF",
                Title: "Backhand Index Pointing Down: Dark Skin Tone"
            }, {
                Emoji: "&#x270C",
                Title: "Victory Hand"
            }, {
                Emoji: "&#x270C&#x1F3FB",
                Title: "Victory Hand: Light Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FC",
                Title: "Victory Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FD",
                Title: "Victory Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FE",
                Title: "Victory Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270C&#x1F3FF",
                Title: "Victory Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91E",
                Title: "Crossed Fingers"
            }, {
                Emoji: "&#x1F91E&#x1F3FB",
                Title: "Crossed Fingers: Light Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FC",
                Title: "Crossed Fingers: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FD",
                Title: "Crossed Fingers: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FE",
                Title: "Crossed Fingers: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91E&#x1F3FF",
                Title: "Crossed Fingers: Dark Skin Tone"
            }, {
                Emoji: "&#x1F596",
                Title: "Vulcan Salute"
            }, {
                Emoji: "&#x1F596&#x1F3FB",
                Title: "Vulcan Salute: Light Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FC",
                Title: "Vulcan Salute: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FD",
                Title: "Vulcan Salute: Medium Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FE",
                Title: "Vulcan Salute: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F596&#x1F3FF",
                Title: "Vulcan Salute: Dark Skin Tone"
            }, {
                Emoji: "&#x1F918",
                Title: "Sign Of The Horns"
            }, {
                Emoji: "&#x1F918&#x1F3FB",
                Title: "Sign Of The Horns: Light Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FC",
                Title: "Sign Of The Horns: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FD",
                Title: "Sign Of The Horns: Medium Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FE",
                Title: "Sign Of The Horns: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F918&#x1F3FF",
                Title: "Sign Of The Horns: Dark Skin Tone"
            }, {
                Emoji: "&#x1F919",
                Title: "Call Me Hand"
            }, {
                Emoji: "&#x1F919&#x1F3FB",
                Title: "Call Me Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FC",
                Title: "Call Me Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FD",
                Title: "Call Me Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FE",
                Title: "Call Me Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F919&#x1F3FF",
                Title: "Call Me Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F590",
                Title: "Raised Hand With Fingers Splayed"
            }, {
                Emoji: "&#x1F590&#x1F3FB",
                Title: "Raised Hand With Fingers Splayed: Light Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FC",
                Title: "Raised Hand With Fingers Splayed: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FD",
                Title: "Raised Hand With Fingers Splayed: Medium Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FE",
                Title: "Raised Hand With Fingers Splayed: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F590&#x1F3FF",
                Title: "Raised Hand With Fingers Splayed: Dark Skin Tone"
            }, {
                Emoji: "&#x270B",
                Title: "Raised Hand"
            }, {
                Emoji: "&#x270B&#x1F3FB",
                Title: "Raised Hand: Light Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FC",
                Title: "Raised Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FD",
                Title: "Raised Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FE",
                Title: "Raised Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270B&#x1F3FF",
                Title: "Raised Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44C",
                Title: "OK Hand"
            }, {
                Emoji: "&#x1F44C&#x1F3FB",
                Title: "OK Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FC",
                Title: "OK Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FD",
                Title: "OK Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FE",
                Title: "OK Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44C&#x1F3FF",
                Title: "OK Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44D",
                Title: "Thumbs Up"
            }, {
                Emoji: "&#x1F44D&#x1F3FB",
                Title: "Thumbs Up: Light Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FC",
                Title: "Thumbs Up: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FD",
                Title: "Thumbs Up: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FE",
                Title: "Thumbs Up: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44D&#x1F3FF",
                Title: "Thumbs Up: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44E",
                Title: "Thumbs Down"
            }, {
                Emoji: "&#x1F44E&#x1F3FB",
                Title: "Thumbs Down: Light Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FC",
                Title: "Thumbs Down: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FD",
                Title: "Thumbs Down: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FE",
                Title: "Thumbs Down: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44E&#x1F3FF",
                Title: "Thumbs Down: Dark Skin Tone"
            }, {
                Emoji: "&#x270A",
                Title: "Raised Fist"
            }, {
                Emoji: "&#x270A&#x1F3FB",
                Title: "Raised Fist: Light Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FC",
                Title: "Raised Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FD",
                Title: "Raised Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FE",
                Title: "Raised Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270A&#x1F3FF",
                Title: "Raised Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44A",
                Title: "Oncoming Fist"
            }, {
                Emoji: "&#x1F44A&#x1F3FB",
                Title: "Oncoming Fist: Light Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FC",
                Title: "Oncoming Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FD",
                Title: "Oncoming Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FE",
                Title: "Oncoming Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44A&#x1F3FF",
                Title: "Oncoming Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91B",
                Title: "Left-Facing Fist"
            }, {
                Emoji: "&#x1F91B&#x1F3FB",
                Title: "Left-Facing Fist: Light Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FC",
                Title: "Left-Facing Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FD",
                Title: "Left-Facing Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FE",
                Title: "Left-Facing Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91B&#x1F3FF",
                Title: "Left-Facing Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91C",
                Title: "Right-Facing Fist"
            }, {
                Emoji: "&#x1F91C&#x1F3FB",
                Title: "Right-Facing Fist: Light Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FC",
                Title: "Right-Facing Fist: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FD",
                Title: "Right-Facing Fist: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FE",
                Title: "Right-Facing Fist: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91C&#x1F3FF",
                Title: "Right-Facing Fist: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91A",
                Title: "Raised Back Of Hand"
            }, {
                Emoji: "&#x1F91A&#x1F3FB",
                Title: "Raised Back Of Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FC",
                Title: "Raised Back Of Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FD",
                Title: "Raised Back Of Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FE",
                Title: "Raised Back Of Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F91A&#x1F3FF",
                Title: "Raised Back Of Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44B",
                Title: "Waving Hand"
            }, {
                Emoji: "&#x1F44B&#x1F3FB",
                Title: "Waving Hand: Light Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FC",
                Title: "Waving Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FD",
                Title: "Waving Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FE",
                Title: "Waving Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44B&#x1F3FF",
                Title: "Waving Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F44F",
                Title: "Clapping Hands"
            }, {
                Emoji: "&#x1F44F&#x1F3FB",
                Title: "Clapping Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FC",
                Title: "Clapping Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FD",
                Title: "Clapping Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FE",
                Title: "Clapping Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F44F&#x1F3FF",
                Title: "Clapping Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x270D",
                Title: "Writing Hand"
            }, {
                Emoji: "&#x270D&#x1F3FB",
                Title: "Writing Hand: Light Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FC",
                Title: "Writing Hand: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FD",
                Title: "Writing Hand: Medium Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FE",
                Title: "Writing Hand: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x270D&#x1F3FF",
                Title: "Writing Hand: Dark Skin Tone"
            }, {
                Emoji: "&#x1F450",
                Title: "Open Hands"
            }, {
                Emoji: "&#x1F450&#x1F3FB",
                Title: "Open Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FC",
                Title: "Open Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FD",
                Title: "Open Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FE",
                Title: "Open Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F450&#x1F3FF",
                Title: "Open Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64C",
                Title: "Raising Hands"
            }, {
                Emoji: "&#x1F64C&#x1F3FB",
                Title: "Raising Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FC",
                Title: "Raising Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FD",
                Title: "Raising Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FE",
                Title: "Raising Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64C&#x1F3FF",
                Title: "Raising Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x1F64F",
                Title: "Folded Hands"
            }, {
                Emoji: "&#x1F64F&#x1F3FB",
                Title: "Folded Hands: Light Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FC",
                Title: "Folded Hands: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FD",
                Title: "Folded Hands: Medium Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FE",
                Title: "Folded Hands: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F64F&#x1F3FF",
                Title: "Folded Hands: Dark Skin Tone"
            }, {
                Emoji: "&#x1F91D",
                Title: "Handshake"
            }, {
                Emoji: "&#x1F485",
                Title: "Nail Polish"
            }, {
                Emoji: "&#x1F485&#x1F3FB",
                Title: "Nail Polish: Light Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FC",
                Title: "Nail Polish: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FD",
                Title: "Nail Polish: Medium Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FE",
                Title: "Nail Polish: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F485&#x1F3FF",
                Title: "Nail Polish: Dark Skin Tone"
            }, {
                Emoji: "&#x1F442",
                Title: "Ear"
            }, {
                Emoji: "&#x1F442&#x1F3FB",
                Title: "Ear: Light Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FC",
                Title: "Ear: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FD",
                Title: "Ear: Medium Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FE",
                Title: "Ear: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F442&#x1F3FF",
                Title: "Ear: Dark Skin Tone"
            }, {
                Emoji: "&#x1F443",
                Title: "Nose"
            }, {
                Emoji: "&#x1F443&#x1F3FB",
                Title: "Nose: Light Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FC",
                Title: "Nose: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FD",
                Title: "Nose: Medium Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FE",
                Title: "Nose: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F443&#x1F3FF",
                Title: "Nose: Dark Skin Tone"
            }, {
                Emoji: "&#x1F463",
                Title: "Footprints"
            }, {
                Emoji: "&#x1F440",
                Title: "Eyes"
            }, {
                Emoji: "&#x1F441",
                Title: "Eye"
            }, {
                Emoji: "&#x1F441&#xFE0F&#x200D&#x1F5E8&#xFE0F",
                Title: "Eye In Speech Bubble"
            }, {
                Emoji: "&#x1F445",
                Title: "Tongue"
            }, {
                Emoji: "&#x1F444",
                Title: "Mouth"
            }, {
                Emoji: "&#x1F48B",
                Title: "Kiss Mark"
            }, {
                Emoji: "&#x1F498",
                Title: "Heart With Arrow"
            }, {
                Emoji: "&#x2764",
                Title: "Red Heart"
            }, {
                Emoji: "&#x1F493",
                Title: "Beating Heart"
            }, {
                Emoji: "&#x1F494",
                Title: "Broken Heart"
            }, {
                Emoji: "&#x1F495",
                Title: "Two Hearts"
            }, {
                Emoji: "&#x1F496",
                Title: "Sparkling Heart"
            }, {
                Emoji: "&#x1F497",
                Title: "Growing Heart"
            }, {
                Emoji: "&#x1F499",
                Title: "Blue Heart"
            }, {
                Emoji: "&#x1F49A",
                Title: "Green Heart"
            }, {
                Emoji: "&#x1F49B",
                Title: "Yellow Heart"
            }, {
                Emoji: "&#x1F49C",
                Title: "Purple Heart"
            }, {
                Emoji: "&#x1F5A4",
                Title: "Black Heart"
            }, {
                Emoji: "&#x1F49D",
                Title: "Heart With Ribbon"
            }, {
                Emoji: "&#x1F49E",
                Title: "Revolving Hearts"
            }, {
                Emoji: "&#x1F49F",
                Title: "Heart Decoration"
            }, {
                Emoji: "&#x2763",
                Title: "Heavy Heart Exclamation"
            }, {
                Emoji: "&#x1F48C",
                Title: "Love Letter"
            }, {
                Emoji: "&#x1F4A4",
                Title: "Zzz"
            }, {
                Emoji: "&#x1F4A2",
                Title: "Anger Symbol"
            }, {
                Emoji: "&#x1F4A3",
                Title: "Bomb"
            }, {
                Emoji: "&#x1F4A5",
                Title: "Collision"
            }, {
                Emoji: "&#x1F4A6",
                Title: "Sweat Droplets"
            }, {
                Emoji: "&#x1F4A8",
                Title: "Dashing Away"
            }, {
                Emoji: "&#x1F4AB",
                Title: "Dizzy"
            }, {
                Emoji: "&#x1F4AC",
                Title: "Speech Balloon"
            }, {
                Emoji: "&#x1F5E8",
                Title: "Left Speech Bubble"
            }, {
                Emoji: "&#x1F5EF",
                Title: "Right Anger Bubble"
            }, {
                Emoji: "&#x1F4AD",
                Title: "Thought Balloon"
            }, {
                Emoji: "&#x1F573",
                Title: "Hole"
            }, {
                Emoji: "&#x1F453",
                Title: "Glasses"
            }, {
                Emoji: "&#x1F576",
                Title: "Sunglasses"
            }, {
                Emoji: "&#x1F454",
                Title: "Necktie"
            }, {
                Emoji: "&#x1F455",
                Title: "T-Shirt"
            }, {
                Emoji: "&#x1F456",
                Title: "Jeans"
            }, {
                Emoji: "&#x1F457",
                Title: "Dress"
            }, {
                Emoji: "&#x1F458",
                Title: "Kimono"
            }, {
                Emoji: "&#x1F459",
                Title: "Bikini"
            }, {
                Emoji: "&#x1F45A",
                Title: "Woman’s Clothes"
            }, {
                Emoji: "&#x1F45B",
                Title: "Purse"
            }, {
                Emoji: "&#x1F45C",
                Title: "Handbag"
            }, {
                Emoji: "&#x1F45D",
                Title: "Clutch Bag"
            }, {
                Emoji: "&#x1F6CD",
                Title: "Shopping Bags"
            }, {
                Emoji: "&#x1F392",
                Title: "School Backpack"
            }, {
                Emoji: "&#x1F45E",
                Title: "Man’s Shoe"
            }, {
                Emoji: "&#x1F45F",
                Title: "Running Shoe"
            }, {
                Emoji: "&#x1F460",
                Title: "High-Heeled Shoe"
            }, {
                Emoji: "&#x1F461",
                Title: "Woman’s Sandal"
            }, {
                Emoji: "&#x1F462",
                Title: "Woman’s Boot"
            }, {
                Emoji: "&#x1F451",
                Title: "Crown"
            }, {
                Emoji: "&#x1F452",
                Title: "Woman’s Hat"
            }, {
                Emoji: "&#x1F3A9",
                Title: "Top Hat"
            }, {
                Emoji: "&#x1F393",
                Title: "Graduation Cap"
            }, {
                Emoji: "&#x26D1",
                Title: "Rescue Worker’s Helmet"
            }, {
                Emoji: "&#x1F4FF",
                Title: "Prayer Beads"
            }, {
                Emoji: "&#x1F484",
                Title: "Lipstick"
            }, {
                Emoji: "&#x1F48D",
                Title: "Ring"
            }, {
                Emoji: "&#x1F48E",
                Title: "Gem Stone"
            }, {
                Emoji: "&#x1F435",
                Title: "Monkey Face"
            }, {
                Emoji: "&#x1F412",
                Title: "Monkey"
            }, {
                Emoji: "&#x1F98D",
                Title: "Gorilla"
            }, {
                Emoji: "&#x1F436",
                Title: "Dog Face"
            }, {
                Emoji: "&#x1F415",
                Title: "Dog"
            }, {
                Emoji: "&#x1F429",
                Title: "Poodle"
            }, {
                Emoji: "&#x1F43A",
                Title: "Wolf Face"
            }, {
                Emoji: "&#x1F98A",
                Title: "Fox Face"
            }, {
                Emoji: "&#x1F431",
                Title: "Cat Face"
            }, {
                Emoji: "&#x1F408",
                Title: "Cat"
            }, {
                Emoji: "&#x1F981",
                Title: "Lion Face"
            }, {
                Emoji: "&#x1F42F",
                Title: "Tiger Face"
            }, {
                Emoji: "&#x1F405",
                Title: "Tiger"
            }, {
                Emoji: "&#x1F406",
                Title: "Leopard"
            }, {
                Emoji: "&#x1F434",
                Title: "Horse Face"
            }, {
                Emoji: "&#x1F40E",
                Title: "Horse"
            }, {
                Emoji: "&#x1F98C",
                Title: "Deer"
            }, {
                Emoji: "&#x1F984",
                Title: "Unicorn Face"
            }, {
                Emoji: "&#x1F42E",
                Title: "Cow Face"
            }, {
                Emoji: "&#x1F402",
                Title: "Ox"
            }, {
                Emoji: "&#x1F403",
                Title: "Water Buffalo"
            }, {
                Emoji: "&#x1F404",
                Title: "Cow"
            }, {
                Emoji: "&#x1F437",
                Title: "Pig Face"
            }, {
                Emoji: "&#x1F416",
                Title: "Pig"
            }, {
                Emoji: "&#x1F417",
                Title: "Boar"
            }, {
                Emoji: "&#x1F43D",
                Title: "Pig Nose"
            }, {
                Emoji: "&#x1F40F",
                Title: "Ram"
            }, {
                Emoji: "&#x1F411",
                Title: "Sheep"
            }, {
                Emoji: "&#x1F410",
                Title: "Goat"
            }, {
                Emoji: "&#x1F42A",
                Title: "Camel"
            }, {
                Emoji: "&#x1F42B",
                Title: "Two-Hump Camel"
            }, {
                Emoji: "&#x1F418",
                Title: "Elephant"
            }, {
                Emoji: "&#x1F98F",
                Title: "Rhinoceros"
            }, {
                Emoji: "&#x1F42D",
                Title: "Mouse Face"
            }, {
                Emoji: "&#x1F401",
                Title: "Mouse"
            }, {
                Emoji: "&#x1F400",
                Title: "Rat"
            }, {
                Emoji: "&#x1F439",
                Title: "Hamster Face"
            }, {
                Emoji: "&#x1F430",
                Title: "Rabbit Face"
            }, {
                Emoji: "&#x1F407",
                Title: "Rabbit"
            }, {
                Emoji: "&#x1F43F",
                Title: "Chipmunk"
            }, {
                Emoji: "&#x1F987",
                Title: "Bat"
            }, {
                Emoji: "&#x1F43B",
                Title: "Bear Face"
            }, {
                Emoji: "&#x1F428",
                Title: "Koala"
            }, {
                Emoji: "&#x1F43C",
                Title: "Panda Face"
            }, {
                Emoji: "&#x1F43E",
                Title: "Paw Prints"
            }, {
                Emoji: "&#x1F983",
                Title: "Turkey"
            }, {
                Emoji: "&#x1F414",
                Title: "Chicken"
            }, {
                Emoji: "&#x1F413",
                Title: "Rooster"
            }, {
                Emoji: "&#x1F423",
                Title: "Hatching Chick"
            }, {
                Emoji: "&#x1F424",
                Title: "Baby Chick"
            }, {
                Emoji: "&#x1F425",
                Title: "Front-Facing Baby Chick"
            }, {
                Emoji: "&#x1F426",
                Title: "Bird"
            }, {
                Emoji: "&#x1F427",
                Title: "Penguin"
            }, {
                Emoji: "&#x1F54A",
                Title: "Dove"
            }, {
                Emoji: "&#x1F985",
                Title: "Eagle"
            }, {
                Emoji: "&#x1F986",
                Title: "Duck"
            }, {
                Emoji: "&#x1F989",
                Title: "Owl"
            }, {
                Emoji: "&#x1F438",
                Title: "Frog Face"
            }, {
                Emoji: "&#x1F40A",
                Title: "Crocodile"
            }, {
                Emoji: "&#x1F422",
                Title: "Turtle"
            }, {
                Emoji: "&#x1F98E",
                Title: "Lizard"
            }, {
                Emoji: "&#x1F40D",
                Title: "Snake"
            }, {
                Emoji: "&#x1F432",
                Title: "Dragon Face"
            }, {
                Emoji: "&#x1F409",
                Title: "Dragon"
            }, {
                Emoji: "&#x1F433",
                Title: "Spouting Whale"
            }, {
                Emoji: "&#x1F40B",
                Title: "Whale"
            }, {
                Emoji: "&#x1F42C",
                Title: "Dolphin"
            }, {
                Emoji: "&#x1F41F",
                Title: "Fish"
            }, {
                Emoji: "&#x1F420",
                Title: "Tropical Fish"
            }, {
                Emoji: "&#x1F421",
                Title: "Blowfish"
            }, {
                Emoji: "&#x1F988",
                Title: "Shark"
            }, {
                Emoji: "&#x1F419",
                Title: "Octopus"
            }, {
                Emoji: "&#x1F41A",
                Title: "Spiral Shell"
            }, {
                Emoji: "&#x1F980",
                Title: "Crab"
            }, {
                Emoji: "&#x1F990",
                Title: "Shrimp"
            }, {
                Emoji: "&#x1F991",
                Title: "Squid"
            }, {
                Emoji: "&#x1F98B",
                Title: "Butterfly"
            }, {
                Emoji: "&#x1F40C",
                Title: "Snail"
            }, {
                Emoji: "&#x1F41B",
                Title: "Bug"
            }, {
                Emoji: "&#x1F41C",
                Title: "Ant"
            }, {
                Emoji: "&#x1F41D",
                Title: "Honeybee"
            }, {
                Emoji: "&#x1F41E",
                Title: "Lady Beetle"
            }, {
                Emoji: "&#x1F577",
                Title: "Spider"
            }, {
                Emoji: "&#x1F578",
                Title: "Spider Web"
            }, {
                Emoji: "&#x1F982",
                Title: "Scorpion"
            }, {
                Emoji: "&#x1F490",
                Title: "Bouquet"
            }, {
                Emoji: "&#x1F338",
                Title: "Cherry Blossom"
            }, {
                Emoji: "&#x1F4AE",
                Title: "White Flower"
            }, {
                Emoji: "&#x1F3F5",
                Title: "Rosette"
            }, {
                Emoji: "&#x1F339",
                Title: "Rose"
            }, {
                Emoji: "&#x1F940",
                Title: "Wilted Flower"
            }, {
                Emoji: "&#x1F33A",
                Title: "Hibiscus"
            }, {
                Emoji: "&#x1F33B",
                Title: "Sunflower"
            }, {
                Emoji: "&#x1F33C",
                Title: "Blossom"
            }, {
                Emoji: "&#x1F337",
                Title: "Tulip"
            }, {
                Emoji: "&#x1F331",
                Title: "Seedling"
            }, {
                Emoji: "&#x1F332",
                Title: "Evergreen Tree"
            }, {
                Emoji: "&#x1F333",
                Title: "Deciduous Tree"
            }, {
                Emoji: "&#x1F334",
                Title: "Palm Tree"
            }, {
                Emoji: "&#x1F335",
                Title: "Cactus"
            }, {
                Emoji: "&#x1F33E",
                Title: "Sheaf Of Rice"
            }, {
                Emoji: "&#x1F33F",
                Title: "Herb"
            }, {
                Emoji: "&#x2618",
                Title: "Shamrock"
            }, {
                Emoji: "&#x1F340",
                Title: "Four Leaf Clover"
            }, {
                Emoji: "&#x1F341",
                Title: "Maple Leaf"
            }, {
                Emoji: "&#x1F342",
                Title: "Fallen Leaf"
            }, {
                Emoji: "&#x1F343",
                Title: "Leaf Fluttering In Wind"
            }, {
                Emoji: "&#x1F347",
                Title: "Grapes"
            }, {
                Emoji: "&#x1F348",
                Title: "Melon"
            }, {
                Emoji: "&#x1F349",
                Title: "Watermelon"
            }, {
                Emoji: "&#x1F34A",
                Title: "Tangerine"
            }, {
                Emoji: "&#x1F34B",
                Title: "Lemon"
            }, {
                Emoji: "&#x1F34C",
                Title: "Banana"
            }, {
                Emoji: "&#x1F34D",
                Title: "Pineapple"
            }, {
                Emoji: "&#x1F34E",
                Title: "Red Apple"
            }, {
                Emoji: "&#x1F34F",
                Title: "Green Apple"
            }, {
                Emoji: "&#x1F350",
                Title: "Pear"
            }, {
                Emoji: "&#x1F351",
                Title: "Peach"
            }, {
                Emoji: "&#x1F352",
                Title: "Cherries"
            }, {
                Emoji: "&#x1F353",
                Title: "Strawberry"
            }, {
                Emoji: "&#x1F95D",
                Title: "Kiwi Fruit"
            }, {
                Emoji: "&#x1F345",
                Title: "Tomato"
            }, {
                Emoji: "&#x1F951",
                Title: "Avocado"
            }, {
                Emoji: "&#x1F346",
                Title: "Eggplant"
            }, {
                Emoji: "&#x1F954",
                Title: "Potato"
            }, {
                Emoji: "&#x1F955",
                Title: "Carrot"
            }, {
                Emoji: "&#x1F33D",
                Title: "Ear Of Corn"
            }, {
                Emoji: "&#x1F336",
                Title: "Hot Pepper"
            }, {
                Emoji: "&#x1F952",
                Title: "Cucumber"
            }, {
                Emoji: "&#x1F344",
                Title: "Mushroom"
            }, {
                Emoji: "&#x1F95C",
                Title: "Peanuts"
            }, {
                Emoji: "&#x1F330",
                Title: "Chestnut"
            }, {
                Emoji: "&#x1F35E",
                Title: "Bread"
            }, {
                Emoji: "&#x1F950",
                Title: "Croissant"
            }, {
                Emoji: "&#x1F956",
                Title: "Baguette Bread"
            }, {
                Emoji: "&#x1F95E",
                Title: "Pancakes"
            }, {
                Emoji: "&#x1F9C0",
                Title: "Cheese Wedge"
            }, {
                Emoji: "&#x1F356",
                Title: "Meat On Bone"
            }, {
                Emoji: "&#x1F357",
                Title: "Poultry Leg"
            }, {
                Emoji: "&#x1F953",
                Title: "Bacon"
            }, {
                Emoji: "&#x1F354",
                Title: "Hamburger"
            }, {
                Emoji: "&#x1F35F",
                Title: "French Fries"
            }, {
                Emoji: "&#x1F355",
                Title: "Pizza"
            }, {
                Emoji: "&#x1F32D",
                Title: "Hot Dog"
            }, {
                Emoji: "&#x1F32E",
                Title: "Taco"
            }, {
                Emoji: "&#x1F32F",
                Title: "Burrito"
            }, {
                Emoji: "&#x1F959",
                Title: "Stuffed Flatbread"
            }, {
                Emoji: "&#x1F95A",
                Title: "Egg"
            }, {
                Emoji: "&#x1F373",
                Title: "Cooking"
            }, {
                Emoji: "&#x1F958",
                Title: "Shallow Pan Of Food"
            }, {
                Emoji: "&#x1F372",
                Title: "Pot Of Food"
            }, {
                Emoji: "&#x1F957",
                Title: "Green Salad"
            }, {
                Emoji: "&#x1F37F",
                Title: "Popcorn"
            }, {
                Emoji: "&#x1F371",
                Title: "Bento Box"
            }, {
                Emoji: "&#x1F358",
                Title: "Rice Cracker"
            }, {
                Emoji: "&#x1F359",
                Title: "Rice Ball"
            }, {
                Emoji: "&#x1F35A",
                Title: "Cooked Rice"
            }, {
                Emoji: "&#x1F35B",
                Title: "Curry Rice"
            }, {
                Emoji: "&#x1F35C",
                Title: "Steaming Bowl"
            }, {
                Emoji: "&#x1F35D",
                Title: "Spaghetti"
            }, {
                Emoji: "&#x1F360",
                Title: "Roasted Sweet Potato"
            }, {
                Emoji: "&#x1F362",
                Title: "Oden"
            }, {
                Emoji: "&#x1F363",
                Title: "Sushi"
            }, {
                Emoji: "&#x1F364",
                Title: "Fried Shrimp"
            }, {
                Emoji: "&#x1F365",
                Title: "Fish Cake With Swirl"
            }, {
                Emoji: "&#x1F361",
                Title: "Dango"
            }, {
                Emoji: "&#x1F366",
                Title: "Soft Ice Cream"
            }, {
                Emoji: "&#x1F367",
                Title: "Shaved Ice"
            }, {
                Emoji: "&#x1F368",
                Title: "Ice Cream"
            }, {
                Emoji: "&#x1F369",
                Title: "Doughnut"
            }, {
                Emoji: "&#x1F36A",
                Title: "Cookie"
            }, {
                Emoji: "&#x1F382",
                Title: "Birthday Cake"
            }, {
                Emoji: "&#x1F370",
                Title: "Shortcake"
            }, {
                Emoji: "&#x1F36B",
                Title: "Chocolate Bar"
            }, {
                Emoji: "&#x1F36C",
                Title: "Candy"
            }, {
                Emoji: "&#x1F36D",
                Title: "Lollipop"
            }, {
                Emoji: "&#x1F36E",
                Title: "Custard"
            }, {
                Emoji: "&#x1F36F",
                Title: "Honey Pot"
            }, {
                Emoji: "&#x1F37C",
                Title: "Baby Bottle"
            }, {
                Emoji: "&#x1F95B",
                Title: "Glass Of Milk"
            }, {
                Emoji: "&#x2615",
                Title: "Hot Beverage"
            }, {
                Emoji: "&#x1F375",
                Title: "Teacup Without Handle"
            }, {
                Emoji: "&#x1F376",
                Title: "Sake"
            }, {
                Emoji: "&#x1F37E",
                Title: "Bottle With Popping Cork"
            }, {
                Emoji: "&#x1F377",
                Title: "Wine Glass"
            }, {
                Emoji: "&#x1F378",
                Title: "Cocktail Glass"
            }, {
                Emoji: "&#x1F379",
                Title: "Tropical Drink"
            }, {
                Emoji: "&#x1F37A",
                Title: "Beer Mug"
            }, {
                Emoji: "&#x1F37B",
                Title: "Clinking Beer Mugs"
            }, {
                Emoji: "&#x1F942",
                Title: "Clinking Glasses"
            }, {
                Emoji: "&#x1F943",
                Title: "Tumbler Glass"
            }, {
                Emoji: "&#x1F37D",
                Title: "Fork And Knife With Plate"
            }, {
                Emoji: "&#x1F374",
                Title: "Fork And Knife"
            }, {
                Emoji: "&#x1F944",
                Title: "Spoon"
            }, {
                Emoji: "&#x1F52A",
                Title: "Kitchen Knife"
            }, {
                Emoji: "&#x1F3FA",
                Title: "Amphora"
            }, {
                Emoji: "&#x1F30D",
                Title: "Globe Showing Europe-Africa"
            }, {
                Emoji: "&#x1F30E",
                Title: "Globe Showing Americas"
            }, {
                Emoji: "&#x1F30F",
                Title: "Globe Showing Asia-Australia"
            }, {
                Emoji: "&#x1F310",
                Title: "Globe With Meridians"
            }, {
                Emoji: "&#x1F5FA",
                Title: "World Map"
            }, {
                Emoji: "&#x1F5FE",
                Title: "Map Of Japan"
            }, {
                Emoji: "&#x1F3D4",
                Title: "Snow-Capped Mountain"
            }, {
                Emoji: "&#x26F0",
                Title: "Mountain"
            }, {
                Emoji: "&#x1F30B",
                Title: "Volcano"
            }, {
                Emoji: "&#x1F5FB",
                Title: "Mount Fuji"
            }, {
                Emoji: "&#x1F3D5",
                Title: "Camping"
            }, {
                Emoji: "&#x1F3D6",
                Title: "Beach With Umbrella"
            }, {
                Emoji: "&#x1F3DC",
                Title: "Desert"
            }, {
                Emoji: "&#x1F3DD",
                Title: "Desert Island"
            }, {
                Emoji: "&#x1F3DE",
                Title: "National Park"
            }, {
                Emoji: "&#x1F3DF",
                Title: "Stadium"
            }, {
                Emoji: "&#x1F3DB",
                Title: "Classical Building"
            }, {
                Emoji: "&#x1F3D7",
                Title: "Building Construction"
            }, {
                Emoji: "&#x1F3D8",
                Title: "House"
            }, {
                Emoji: "&#x1F3D9",
                Title: "Cityscape"
            }, {
                Emoji: "&#x1F3DA",
                Title: "Derelict House"
            }, {
                Emoji: "&#x1F3E0",
                Title: "House"
            }, {
                Emoji: "&#x1F3E1",
                Title: "House With Garden"
            }, {
                Emoji: "&#x1F3E2",
                Title: "Office Building"
            }, {
                Emoji: "&#x1F3E3",
                Title: "Japanese Post Office"
            }, {
                Emoji: "&#x1F3E4",
                Title: "Post Office"
            }, {
                Emoji: "&#x1F3E5",
                Title: "Hospital"
            }, {
                Emoji: "&#x1F3E6",
                Title: "Bank"
            }, {
                Emoji: "&#x1F3E8",
                Title: "Hotel"
            }, {
                Emoji: "&#x1F3E9",
                Title: "Love Hotel"
            }, {
                Emoji: "&#x1F3EA",
                Title: "Convenience Store"
            }, {
                Emoji: "&#x1F3EB",
                Title: "School"
            }, {
                Emoji: "&#x1F3EC",
                Title: "Department Store"
            }, {
                Emoji: "&#x1F3ED",
                Title: "Factory"
            }, {
                Emoji: "&#x1F3EF",
                Title: "Japanese Castle"
            }, {
                Emoji: "&#x1F3F0",
                Title: "Castle"
            }, {
                Emoji: "&#x1F492",
                Title: "Wedding"
            }, {
                Emoji: "&#x1F5FC",
                Title: "Tokyo Tower"
            }, {
                Emoji: "&#x1F5FD",
                Title: "Statue Of Liberty"
            }, {
                Emoji: "&#x26EA",
                Title: "Church"
            }, {
                Emoji: "&#x1F54C",
                Title: "Mosque"
            }, {
                Emoji: "&#x1F54D",
                Title: "Synagogue"
            }, {
                Emoji: "&#x26E9",
                Title: "Shinto Shrine"
            }, {
                Emoji: "&#x1F54B",
                Title: "Kaaba"
            }, {
                Emoji: "&#x26F2",
                Title: "Fountain"
            }, {
                Emoji: "&#x26FA",
                Title: "Tent"
            }, {
                Emoji: "&#x1F301",
                Title: "Foggy"
            }, {
                Emoji: "&#x1F303",
                Title: "Night With Stars"
            }, {
                Emoji: "&#x1F304",
                Title: "Sunrise Over Mountains"
            }, {
                Emoji: "&#x1F305",
                Title: "Sunrise"
            }, {
                Emoji: "&#x1F306",
                Title: "Cityscape At Dusk"
            }, {
                Emoji: "&#x1F307",
                Title: "Sunset"
            }, {
                Emoji: "&#x1F309",
                Title: "Bridge At Night"
            }, {
                Emoji: "&#x2668",
                Title: "Hot Springs"
            }, {
                Emoji: "&#x1F30C",
                Title: "Milky Way"
            }, {
                Emoji: "&#x1F3A0",
                Title: "Carousel Horse"
            }, {
                Emoji: "&#x1F3A1",
                Title: "Ferris Wheel"
            }, {
                Emoji: "&#x1F3A2",
                Title: "Roller Coaster"
            }, {
                Emoji: "&#x1F488",
                Title: "Barber Pole"
            }, {
                Emoji: "&#x1F3AA",
                Title: "Circus Tent"
            }, {
                Emoji: "&#x1F3AD",
                Title: "Performing Arts"
            }, {
                Emoji: "&#x1F5BC",
                Title: "Framed Picture"
            }, {
                Emoji: "&#x1F3A8",
                Title: "Artist Palette"
            }, {
                Emoji: "&#x1F3B0",
                Title: "Slot Machine"
            }, {
                Emoji: "&#x1F682",
                Title: "Locomotive"
            }, {
                Emoji: "&#x1F683",
                Title: "Railway Car"
            }, {
                Emoji: "&#x1F684",
                Title: "High-Speed Train"
            }, {
                Emoji: "&#x1F685",
                Title: "High-Speed Train With Bullet Nose"
            }, {
                Emoji: "&#x1F686",
                Title: "Train"
            }, {
                Emoji: "&#x1F687",
                Title: "Metro"
            }, {
                Emoji: "&#x1F688",
                Title: "Light Rail"
            }, {
                Emoji: "&#x1F689",
                Title: "Station"
            }, {
                Emoji: "&#x1F68A",
                Title: "Tram"
            }, {
                Emoji: "&#x1F69D",
                Title: "Monorail"
            }, {
                Emoji: "&#x1F69E",
                Title: "Mountain Railway"
            }, {
                Emoji: "&#x1F68B",
                Title: "Tram Car"
            }, {
                Emoji: "&#x1F68C",
                Title: "Bus"
            }, {
                Emoji: "&#x1F68D",
                Title: "Oncoming Bus"
            }, {
                Emoji: "&#x1F68E",
                Title: "Trolleybus"
            }, {
                Emoji: "&#x1F690",
                Title: "Minibus"
            }, {
                Emoji: "&#x1F691",
                Title: "Ambulance"
            }, {
                Emoji: "&#x1F692",
                Title: "Fire Engine"
            }, {
                Emoji: "&#x1F693",
                Title: "Police Car"
            }, {
                Emoji: "&#x1F694",
                Title: "Oncoming Police Car"
            }, {
                Emoji: "&#x1F695",
                Title: "Taxi"
            }, {
                Emoji: "&#x1F696",
                Title: "Oncoming Taxi"
            }, {
                Emoji: "&#x1F697",
                Title: "Automobile"
            }, {
                Emoji: "&#x1F698",
                Title: "Oncoming Automobile"
            }, {
                Emoji: "&#x1F699",
                Title: "Sport Utility Vehicle"
            }, {
                Emoji: "&#x1F69A",
                Title: "Delivery Truck"
            }, {
                Emoji: "&#x1F69B",
                Title: "Articulated Lorry"
            }, {
                Emoji: "&#x1F69C",
                Title: "Tractor"
            }, {
                Emoji: "&#x1F6B2",
                Title: "Bicycle"
            }, {
                Emoji: "&#x1F6F4",
                Title: "Kick Scooter"
            }, {
                Emoji: "&#x1F6F5",
                Title: "Motor Scooter"
            }, {
                Emoji: "&#x1F68F",
                Title: "Bus Stop"
            }, {
                Emoji: "&#x1F6E3",
                Title: "Motorway"
            }, {
                Emoji: "&#x1F6E4",
                Title: "Railway Track"
            }, {
                Emoji: "&#x26FD",
                Title: "Fuel Pump"
            }, {
                Emoji: "&#x1F6A8",
                Title: "Police Car Light"
            }, {
                Emoji: "&#x1F6A5",
                Title: "Horizontal Traffic Light"
            }, {
                Emoji: "&#x1F6A6",
                Title: "Vertical Traffic Light"
            }, {
                Emoji: "&#x1F6A7",
                Title: "Construction"
            }, {
                Emoji: "&#x1F6D1",
                Title: "Stop Sign"
            }, {
                Emoji: "&#x2693",
                Title: "Anchor"
            }, {
                Emoji: "&#x26F5",
                Title: "Sailboat"
            }, {
                Emoji: "&#x1F6F6",
                Title: "Canoe"
            }, {
                Emoji: "&#x1F6A4",
                Title: "Speedboat"
            }, {
                Emoji: "&#x1F6F3",
                Title: "Passenger Ship"
            }, {
                Emoji: "&#x26F4",
                Title: "Ferry"
            }, {
                Emoji: "&#x1F6E5",
                Title: "Motor Boat"
            }, {
                Emoji: "&#x1F6A2",
                Title: "Ship"
            }, {
                Emoji: "&#x2708",
                Title: "Airplane"
            }, {
                Emoji: "&#x1F6E9",
                Title: "Small Airplane"
            }, {
                Emoji: "&#x1F6EB",
                Title: "Airplane Departure"
            }, {
                Emoji: "&#x1F6EC",
                Title: "Airplane Arrival"
            }, {
                Emoji: "&#x1F4BA",
                Title: "Seat"
            }, {
                Emoji: "&#x1F681",
                Title: "Helicopter"
            }, {
                Emoji: "&#x1F69F",
                Title: "Suspension Railway"
            }, {
                Emoji: "&#x1F6A0",
                Title: "Mountain Cableway"
            }, {
                Emoji: "&#x1F6A1",
                Title: "Aerial Tramway"
            }, {
                Emoji: "&#x1F680",
                Title: "Rocket"
            }, {
                Emoji: "&#x1F6F0",
                Title: "Satellite"
            }, {
                Emoji: "&#x1F6CE",
                Title: "Bellhop Bell"
            }, {
                Emoji: "&#x1F6AA",
                Title: "Door"
            }, {
                Emoji: "&#x1F6CC",
                Title: "Person In Bed"
            }, {
                Emoji: "&#x1F6CC&#x1F3FB",
                Title: "Person In Bed: Light Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FC",
                Title: "Person In Bed: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FD",
                Title: "Person In Bed: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FE",
                Title: "Person In Bed: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6CC&#x1F3FF",
                Title: "Person In Bed: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6CF",
                Title: "Bed"
            }, {
                Emoji: "&#x1F6CB",
                Title: "Couch And Lamp"
            }, {
                Emoji: "&#x1F6BD",
                Title: "Toilet"
            }, {
                Emoji: "&#x1F6BF",
                Title: "Shower"
            }, {
                Emoji: "&#x1F6C0",
                Title: "Person Taking Bath"
            }, {
                Emoji: "&#x1F6C0&#x1F3FB",
                Title: "Person Taking Bath: Light Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FC",
                Title: "Person Taking Bath: Medium-Light Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FD",
                Title: "Person Taking Bath: Medium Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FE",
                Title: "Person Taking Bath: Medium-Dark Skin Tone"
            }, {
                Emoji: "&#x1F6C0&#x1F3FF",
                Title: "Person Taking Bath: Dark Skin Tone"
            }, {
                Emoji: "&#x1F6C1",
                Title: "Bathtub"
            }, {
                Emoji: "&#x231B",
                Title: "Hourglass"
            }, {
                Emoji: "&#x23F3",
                Title: "Hourglass With Flowing Sand"
            }, {
                Emoji: "&#x231A",
                Title: "Watch"
            }, {
                Emoji: "&#x23F0",
                Title: "Alarm Clock"
            }, {
                Emoji: "&#x23F1",
                Title: "Stopwatch"
            }, {
                Emoji: "&#x23F2",
                Title: "Timer Clock"
            }, {
                Emoji: "&#x1F570",
                Title: "Mantelpiece Clock"
            }, {
                Emoji: "&#x1F55B",
                Title: "Twelve O’clock"
            }, {
                Emoji: "&#x1F567",
                Title: "Twelve-Thirty"
            }, {
                Emoji: "&#x1F550",
                Title: "One O’clock"
            }, {
                Emoji: "&#x1F55C",
                Title: "One-Thirty"
            }, {
                Emoji: "&#x1F551",
                Title: "Two O’clock"
            }, {
                Emoji: "&#x1F55D",
                Title: "Two-Thirty"
            }, {
                Emoji: "&#x1F552",
                Title: "Three O’clock"
            }, {
                Emoji: "&#x1F55E",
                Title: "Three-Thirty"
            }, {
                Emoji: "&#x1F553",
                Title: "Four O’clock"
            }, {
                Emoji: "&#x1F55F",
                Title: "Four-Thirty"
            }, {
                Emoji: "&#x1F554",
                Title: "Five O’clock"
            }, {
                Emoji: "&#x1F560",
                Title: "Five-Thirty"
            }, {
                Emoji: "&#x1F555",
                Title: "Six O’clock"
            }, {
                Emoji: "&#x1F561",
                Title: "Six-Thirty"
            }, {
                Emoji: "&#x1F556",
                Title: "Seven O’clock"
            }, {
                Emoji: "&#x1F562",
                Title: "Seven-Thirty"
            }, {
                Emoji: "&#x1F557",
                Title: "Eight O’clock"
            }, {
                Emoji: "&#x1F563",
                Title: "Eight-Thirty"
            }, {
                Emoji: "&#x1F558",
                Title: "Nine O’clock"
            }, {
                Emoji: "&#x1F564",
                Title: "Nine-Thirty"
            }, {
                Emoji: "&#x1F559",
                Title: "Ten O’clock"
            }, {
                Emoji: "&#x1F565",
                Title: "Ten-Thirty"
            }, {
                Emoji: "&#x1F55A",
                Title: "Eleven O’clock"
            }, {
                Emoji: "&#x1F566",
                Title: "Eleven-Thirty"
            }, {
                Emoji: "&#x1F311",
                Title: "New Moon"
            }, {
                Emoji: "&#x1F312",
                Title: "Waxing Crescent Moon"
            }, {
                Emoji: "&#x1F313",
                Title: "First Quarter Moon"
            }, {
                Emoji: "&#x1F314",
                Title: "Waxing Gibbous Moon"
            }, {
                Emoji: "&#x1F315",
                Title: "Full Moon"
            }, {
                Emoji: "&#x1F316",
                Title: "Waning Gibbous Moon"
            }, {
                Emoji: "&#x1F317",
                Title: "Last Quarter Moon"
            }, {
                Emoji: "&#x1F318",
                Title: "Waning Crescent Moon"
            }, {
                Emoji: "&#x1F319",
                Title: "Crescent Moon"
            }, {
                Emoji: "&#x1F31A",
                Title: "New Moon Face"
            }, {
                Emoji: "&#x1F31B",
                Title: "First Quarter Moon With Face"
            }, {
                Emoji: "&#x1F31C",
                Title: "Last Quarter Moon With Face"
            }, {
                Emoji: "&#x1F321",
                Title: "Thermometer"
            }, {
                Emoji: "&#x2600",
                Title: "Sun"
            }, {
                Emoji: "&#x1F31D",
                Title: "Full Moon With Face"
            }, {
                Emoji: "&#x1F31E",
                Title: "Sun With Face"
            }, {
                Emoji: "&#x2B50",
                Title: "White Medium Star"
            }, {
                Emoji: "&#x1F31F",
                Title: "Glowing Star"
            }, {
                Emoji: "&#x1F320",
                Title: "Shooting Star"
            }, {
                Emoji: "&#x2601",
                Title: "Cloud"
            }, {
                Emoji: "&#x26C5",
                Title: "Sun Behind Cloud"
            }, {
                Emoji: "&#x26C8",
                Title: "Cloud With Lightning And Rain"
            }, {
                Emoji: "&#x1F324",
                Title: "Sun Behind Small Cloud"
            }, {
                Emoji: "&#x1F325",
                Title: "Sun Behind Large Cloud"
            }, {
                Emoji: "&#x1F326",
                Title: "Sun Behind Rain Cloud"
            }, {
                Emoji: "&#x1F327",
                Title: "Cloud With Rain"
            }, {
                Emoji: "&#x1F328",
                Title: "Cloud With Snow"
            }, {
                Emoji: "&#x1F329",
                Title: "Cloud With Lightning"
            }, {
                Emoji: "&#x1F32A",
                Title: "Tornado"
            }, {
                Emoji: "&#x1F32B",
                Title: "Fog"
            }, {
                Emoji: "&#x1F32C",
                Title: "Wind Face"
            }, {
                Emoji: "&#x1F300",
                Title: "Cyclone"
            }, {
                Emoji: "&#x1F308",
                Title: "Rainbow"
            }, {
                Emoji: "&#x1F302",
                Title: "Closed Umbrella"
            }, {
                Emoji: "&#x2602",
                Title: "Umbrella"
            }, {
                Emoji: "&#x2614",
                Title: "Umbrella With Rain Drops"
            }, {
                Emoji: "&#x26F1",
                Title: "Umbrella On Ground"
            }, {
                Emoji: "&#x26A1",
                Title: "High Voltage"
            }, {
                Emoji: "&#x2744",
                Title: "Snowflake"
            }, {
                Emoji: "&#x2603",
                Title: "Snowman"
            }, {
                Emoji: "&#x26C4",
                Title: "Snowman Without Snow"
            }, {
                Emoji: "&#x2604",
                Title: "Comet"
            }, {
                Emoji: "&#x1F525",
                Title: "Fire"
            }, {
                Emoji: "&#x1F4A7",
                Title: "Droplet"
            }, {
                Emoji: "&#x1F30A",
                Title: "Water Wave"
            }, {
                Emoji: "&#x1F383",
                Title: "Jack-O-Lantern"
            }, {
                Emoji: "&#x1F384",
                Title: "Christmas Tree"
            }, {
                Emoji: "&#x1F386",
                Title: "Fireworks"
            }, {
                Emoji: "&#x1F387",
                Title: "Sparkler"
            }, {
                Emoji: "&#x2728",
                Title: "Sparkles"
            }, {
                Emoji: "&#x1F388",
                Title: "Balloon"
            }, {
                Emoji: "&#x1F389",
                Title: "Party Popper"
            }, {
                Emoji: "&#x1F38A",
                Title: "Confetti Ball"
            }, {
                Emoji: "&#x1F38B",
                Title: "Tanabata Tree"
            }, {
                Emoji: "&#x1F38D",
                Title: "Pine Decoration"
            }, {
                Emoji: "&#x1F38E",
                Title: "Japanese Dolls"
            }, {
                Emoji: "&#x1F38F",
                Title: "Carp Streamer"
            }, {
                Emoji: "&#x1F390",
                Title: "Wind Chime"
            }, {
                Emoji: "&#x1F391",
                Title: "Moon Viewing Ceremony"
            }, {
                Emoji: "&#x1F380",
                Title: "Ribbon"
            }, {
                Emoji: "&#x1F381",
                Title: "Wrapped Gift"
            }, {
                Emoji: "&#x1F397",
                Title: "Reminder Ribbon"
            }, {
                Emoji: "&#x1F39F",
                Title: "Admission Tickets"
            }, {
                Emoji: "&#x1F3AB",
                Title: "Ticket"
            }, {
                Emoji: "&#x1F396",
                Title: "Military Medal"
            }, {
                Emoji: "&#x1F3C6",
                Title: "Trophy"
            }, {
                Emoji: "&#x1F3C5",
                Title: "Sports Medal"
            }, {
                Emoji: "&#x1F947",
                Title: "1st Place Medal"
            }, {
                Emoji: "&#x1F948",
                Title: "2nd Place Medal"
            }, {
                Emoji: "&#x1F949",
                Title: "3rd Place Medal"
            }, {
                Emoji: "&#x26BD",
                Title: "Soccer Ball"
            }, {
                Emoji: "&#x26BE",
                Title: "Baseball"
            }, {
                Emoji: "&#x1F3C0",
                Title: "Basketball"
            }, {
                Emoji: "&#x1F3D0",
                Title: "Volleyball"
            }, {
                Emoji: "&#x1F3C8",
                Title: "American Football"
            }, {
                Emoji: "&#x1F3C9",
                Title: "Rugby Football"
            }, {
                Emoji: "&#x1F3BE",
                Title: "Tennis"
            }, {
                Emoji: "&#x1F3B1",
                Title: "Pool 8 Ball"
            }, {
                Emoji: "&#x1F3B3",
                Title: "Bowling"
            }, {
                Emoji: "&#x1F3CF",
                Title: "Cricket"
            }, {
                Emoji: "&#x1F3D1",
                Title: "Field Hockey"
            }, {
                Emoji: "&#x1F3D2",
                Title: "Ice Hockey"
            }, {
                Emoji: "&#x1F3D3",
                Title: "Ping Pong"
            }, {
                Emoji: "&#x1F3F8",
                Title: "Badminton"
            }, {
                Emoji: "&#x1F94A",
                Title: "Boxing Glove"
            }, {
                Emoji: "&#x1F94B",
                Title: "Martial Arts Uniform"
            }, {
                Emoji: "&#x1F945",
                Title: "Goal Net"
            }, {
                Emoji: "&#x1F3AF",
                Title: "Direct Hit"
            }, {
                Emoji: "&#x26F3",
                Title: "Flag In Hole"
            }, {
                Emoji: "&#x26F8",
                Title: "Ice Skate"
            }, {
                Emoji: "&#x1F3A3",
                Title: "Fishing Pole"
            }, {
                Emoji: "&#x1F3BD",
                Title: "Running Shirt"
            }, {
                Emoji: "&#x1F3BF",
                Title: "Skis"
            }, {
                Emoji: "&#x1F3AE",
                Title: "Video Game"
            }, {
                Emoji: "&#x1F579",
                Title: "Joystick"
            }, {
                Emoji: "&#x1F3B2",
                Title: "Game Die"
            }, {
                Emoji: "&#x2660",
                Title: "Spade Suit"
            }, {
                Emoji: "&#x2665",
                Title: "Heart Suit"
            }, {
                Emoji: "&#x2666",
                Title: "Diamond Suit"
            }, {
                Emoji: "&#x2663",
                Title: "Club Suit"
            }, {
                Emoji: "&#x1F0CF",
                Title: "Joker"
            }, {
                Emoji: "&#x1F004",
                Title: "Mahjong Red Dragon"
            }, {
                Emoji: "&#x1F3B4",
                Title: "Flower Playing Cards"
            }, {
                Emoji: "&#x1F507",
                Title: "Muted Speaker"
            }, {
                Emoji: "&#x1F508",
                Title: "Speaker Low Volume"
            }, {
                Emoji: "&#x1F509",
                Title: "Speaker Medium Volume"
            }, {
                Emoji: "&#x1F50A",
                Title: "Speaker High Volume"
            }, {
                Emoji: "&#x1F4E2",
                Title: "Loudspeaker"
            }, {
                Emoji: "&#x1F4E3",
                Title: "Megaphone"
            }, {
                Emoji: "&#x1F4EF",
                Title: "Postal Horn"
            }, {
                Emoji: "&#x1F514",
                Title: "Bell"
            }, {
                Emoji: "&#x1F515",
                Title: "Bell With Slash"
            }, {
                Emoji: "&#x1F3BC",
                Title: "Musical Score"
            }, {
                Emoji: "&#x1F3B5",
                Title: "Musical Note"
            }, {
                Emoji: "&#x1F3B6",
                Title: "Musical Notes"
            }, {
                Emoji: "&#x1F399",
                Title: "Studio Microphone"
            }, {
                Emoji: "&#x1F39A",
                Title: "Level Slider"
            }, {
                Emoji: "&#x1F39B",
                Title: "Control Knobs"
            }, {
                Emoji: "&#x1F3A4",
                Title: "Microphone"
            }, {
                Emoji: "&#x1F3A7",
                Title: "Headphone"
            }, {
                Emoji: "&#x1F4FB",
                Title: "Radio"
            }, {
                Emoji: "&#x1F3B7",
                Title: "Saxophone"
            }, {
                Emoji: "&#x1F3B8",
                Title: "Guitar"
            }, {
                Emoji: "&#x1F3B9",
                Title: "Musical Keyboard"
            }, {
                Emoji: "&#x1F3BA",
                Title: "Trumpet"
            }, {
                Emoji: "&#x1F3BB",
                Title: "Violin"
            }, {
                Emoji: "&#x1F941",
                Title: "Drum"
            }, {
                Emoji: "&#x1F4F1",
                Title: "Mobile Phone"
            }, {
                Emoji: "&#x1F4F2",
                Title: "Mobile Phone With Arrow"
            }, {
                Emoji: "&#x260E",
                Title: "Telephone"
            }, {
                Emoji: "&#x1F4DE",
                Title: "Telephone Receiver"
            }, {
                Emoji: "&#x1F4DF",
                Title: "Pager"
            }, {
                Emoji: "&#x1F4E0",
                Title: "Fax Machine"
            }, {
                Emoji: "&#x1F50B",
                Title: "Battery"
            }, {
                Emoji: "&#x1F50C",
                Title: "Electric Plug"
            }, {
                Emoji: "&#x1F4BB",
                Title: "Laptop Computer"
            }, {
                Emoji: "&#x1F5A5",
                Title: "Desktop Computer"
            }, {
                Emoji: "&#x1F5A8",
                Title: "Printer"
            }, {
                Emoji: "&#x2328",
                Title: "Keyboard"
            }, {
                Emoji: "&#x1F5B1",
                Title: "Computer Mouse"
            }, {
                Emoji: "&#x1F5B2",
                Title: "Trackball"
            }, {
                Emoji: "&#x1F4BD",
                Title: "Computer Disk"
            }, {
                Emoji: "&#x1F4BE",
                Title: "Floppy Disk"
            }, {
                Emoji: "&#x1F4BF",
                Title: "Optical Disk"
            }, {
                Emoji: "&#x1F4C0",
                Title: "Dvd"
            }, {
                Emoji: "&#x1F3A5",
                Title: "Movie Camera"
            }, {
                Emoji: "&#x1F39E",
                Title: "Film Frames"
            }, {
                Emoji: "&#x1F4FD",
                Title: "Film Projector"
            }, {
                Emoji: "&#x1F3AC",
                Title: "Clapper Board"
            }, {
                Emoji: "&#x1F4FA",
                Title: "Television"
            }, {
                Emoji: "&#x1F4F7",
                Title: "Camera"
            }, {
                Emoji: "&#x1F4F8",
                Title: "Camera With Flash"
            }, {
                Emoji: "&#x1F4F9",
                Title: "Video Camera"
            }, {
                Emoji: "&#x1F4FC",
                Title: "Videocassette"
            }, {
                Emoji: "&#x1F50D",
                Title: "Left-Pointing Magnifying Glass"
            }, {
                Emoji: "&#x1F50E",
                Title: "Right-Pointing Magnifying Glass"
            }, {
                Emoji: "&#x1F52C",
                Title: "Microscope"
            }, {
                Emoji: "&#x1F52D",
                Title: "Telescope"
            }, {
                Emoji: "&#x1F4E1",
                Title: "Satellite Antenna"
            }, {
                Emoji: "&#x1F56F",
                Title: "Candle"
            }, {
                Emoji: "&#x1F4A1",
                Title: "Light Bulb"
            }, {
                Emoji: "&#x1F526",
                Title: "Flashlight"
            }, {
                Emoji: "&#x1F3EE",
                Title: "Red Paper Lantern"
            }, {
                Emoji: "&#x1F4D4",
                Title: "Notebook With Decorative Cover"
            }, {
                Emoji: "&#x1F4D5",
                Title: "Closed Book"
            }, {
                Emoji: "&#x1F4D6",
                Title: "Open Book"
            }, {
                Emoji: "&#x1F4D7",
                Title: "Green Book"
            }, {
                Emoji: "&#x1F4D8",
                Title: "Blue Book"
            }, {
                Emoji: "&#x1F4D9",
                Title: "Orange Book"
            }, {
                Emoji: "&#x1F4DA",
                Title: "Books"
            }, {
                Emoji: "&#x1F4D3",
                Title: "Notebook"
            }, {
                Emoji: "&#x1F4D2",
                Title: "Ledger"
            }, {
                Emoji: "&#x1F4C3",
                Title: "Page With Curl"
            }, {
                Emoji: "&#x1F4DC",
                Title: "Scroll"
            }, {
                Emoji: "&#x1F4C4",
                Title: "Page Facing Up"
            }, {
                Emoji: "&#x1F4F0",
                Title: "Newspaper"
            }, {
                Emoji: "&#x1F5DE",
                Title: "Rolled-Up Newspaper"
            }, {
                Emoji: "&#x1F4D1",
                Title: "Bookmark Tabs"
            }, {
                Emoji: "&#x1F516",
                Title: "Bookmark"
            }, {
                Emoji: "&#x1F3F7",
                Title: "Label"
            }, {
                Emoji: "&#x1F4B0",
                Title: "Money Bag"
            }, {
                Emoji: "&#x1F4B4",
                Title: "Yen Banknote"
            }, {
                Emoji: "&#x1F4B5",
                Title: "Dollar Banknote"
            }, {
                Emoji: "&#x1F4B6",
                Title: "Euro Banknote"
            }, {
                Emoji: "&#x1F4B7",
                Title: "Pound Banknote"
            }, {
                Emoji: "&#x1F4B8",
                Title: "Money With Wings"
            }, {
                Emoji: "&#x1F4B3",
                Title: "Credit Card"
            }, {
                Emoji: "&#x1F4B9",
                Title: "Chart Increasing With Yen"
            }, {
                Emoji: "&#x1F4B1",
                Title: "Currency Exchange"
            }, {
                Emoji: "&#x1F4B2",
                Title: "Heavy Dollar Sign"
            }, {
                Emoji: "&#x2709",
                Title: "Envelope"
            }, {
                Emoji: "&#x1F4E7",
                Title: "E-Mail"
            }, {
                Emoji: "&#x1F4E8",
                Title: "Incoming Envelope"
            }, {
                Emoji: "&#x1F4E9",
                Title: "Envelope With Arrow"
            }, {
                Emoji: "&#x1F4E4",
                Title: "Outbox Tray"
            }, {
                Emoji: "&#x1F4E5",
                Title: "Inbox Tray"
            }, {
                Emoji: "&#x1F4E6",
                Title: "Package"
            }, {
                Emoji: "&#x1F4EB",
                Title: "Closed Mailbox With Raised Flag"
            }, {
                Emoji: "&#x1F4EA",
                Title: "Closed Mailbox With Lowered Flag"
            }, {
                Emoji: "&#x1F4EC",
                Title: "Open Mailbox With Raised Flag"
            }, {
                Emoji: "&#x1F4ED",
                Title: "Open Mailbox With Lowered Flag"
            }, {
                Emoji: "&#x1F4EE",
                Title: "Postbox"
            }, {
                Emoji: "&#x1F5F3",
                Title: "Ballot Box With Ballot"
            }, {
                Emoji: "&#x270F",
                Title: "Pencil"
            }, {
                Emoji: "&#x2712",
                Title: "Black Nib"
            }, {
                Emoji: "&#x1F58B",
                Title: "Fountain Pen"
            }, {
                Emoji: "&#x1F58A",
                Title: "Pen"
            }, {
                Emoji: "&#x1F58C",
                Title: "Paintbrush"
            }, {
                Emoji: "&#x1F58D",
                Title: "Crayon"
            }, {
                Emoji: "&#x1F4DD",
                Title: "Memo"
            }, {
                Emoji: "&#x1F4BC",
                Title: "Briefcase"
            }, {
                Emoji: "&#x1F4C1",
                Title: "File Folder"
            }, {
                Emoji: "&#x1F4C2",
                Title: "Open File Folder"
            }, {
                Emoji: "&#x1F5C2",
                Title: "Card Index Dividers"
            }, {
                Emoji: "&#x1F4C5",
                Title: "Calendar"
            }, {
                Emoji: "&#x1F4C6",
                Title: "Tear-Off Calendar"
            }, {
                Emoji: "&#x1F5D2",
                Title: "Spiral Notepad"
            }, {
                Emoji: "&#x1F5D3",
                Title: "Spiral Calendar"
            }, {
                Emoji: "&#x1F4C7",
                Title: "Card Index"
            }, {
                Emoji: "&#x1F4C8",
                Title: "Chart Increasing"
            }, {
                Emoji: "&#x1F4C9",
                Title: "Chart Decreasing"
            }, {
                Emoji: "&#x1F4CA",
                Title: "Bar Chart"
            }, {
                Emoji: "&#x1F4CB",
                Title: "Clipboard"
            }, {
                Emoji: "&#x1F4CC",
                Title: "Pushpin"
            }, {
                Emoji: "&#x1F4CD",
                Title: "Round Pushpin"
            }, {
                Emoji: "&#x1F4CE",
                Title: "Paperclip"
            }, {
                Emoji: "&#x1F587",
                Title: "Linked Paperclips"
            }, {
                Emoji: "&#x1F4CF",
                Title: "Straight Ruler"
            }, {
                Emoji: "&#x1F4D0",
                Title: "Triangular Ruler"
            }, {
                Emoji: "&#x2702",
                Title: "Scissors"
            }, {
                Emoji: "&#x1F5C3",
                Title: "Card File Box"
            }, {
                Emoji: "&#x1F5C4",
                Title: "File Cabinet"
            }, {
                Emoji: "&#x1F5D1",
                Title: "Wastebasket"
            }, {
                Emoji: "&#x1F512",
                Title: "Locked"
            }, {
                Emoji: "&#x1F513",
                Title: "Unlocked"
            }, {
                Emoji: "&#x1F50F",
                Title: "Locked With Pen"
            }, {
                Emoji: "&#x1F510",
                Title: "Locked With Key"
            }, {
                Emoji: "&#x1F511",
                Title: "Key"
            }, {
                Emoji: "&#x1F5DD",
                Title: "Old Key"
            }, {
                Emoji: "&#x1F528",
                Title: "Hammer"
            }, {
                Emoji: "&#x26CF",
                Title: "Pick"
            }, {
                Emoji: "&#x2692",
                Title: "Hammer And Pick"
            }, {
                Emoji: "&#x1F6E0",
                Title: "Hammer And Wrench"
            }, {
                Emoji: "&#x1F5E1",
                Title: "Dagger"
            }, {
                Emoji: "&#x2694",
                Title: "Crossed Swords"
            }, {
                Emoji: "&#x1F52B",
                Title: "Pistol"
            }, {
                Emoji: "&#x1F3F9",
                Title: "Bow And Arrow"
            }, {
                Emoji: "&#x1F6E1",
                Title: "Shield"
            }, {
                Emoji: "&#x1F527",
                Title: "Wrench"
            }, {
                Emoji: "&#x1F529",
                Title: "Nut And Bolt"
            }, {
                Emoji: "&#x2699",
                Title: "Gear"
            }, {
                Emoji: "&#x1F5DC",
                Title: "Clamp"
            }, {
                Emoji: "&#x2697",
                Title: "Alembic"
            }, {
                Emoji: "&#x2696",
                Title: "Balance Scale"
            }, {
                Emoji: "&#x1F517",
                Title: "Link"
            }, {
                Emoji: "&#x26D3",
                Title: "Chains"
            }, {
                Emoji: "&#x1F489",
                Title: "Syringe"
            }, {
                Emoji: "&#x1F48A",
                Title: "Pill"
            }, {
                Emoji: "&#x1F6AC",
                Title: "Cigarette"
            }, {
                Emoji: "&#x26B0",
                Title: "Coffin"
            }, {
                Emoji: "&#x26B1",
                Title: "Funeral Urn"
            }, {
                Emoji: "&#x1F5FF",
                Title: "Moai"
            }, {
                Emoji: "&#x1F6E2",
                Title: "Oil Drum"
            }, {
                Emoji: "&#x1F52E",
                Title: "Crystal Ball"
            }, {
                Emoji: "&#x1F6D2",
                Title: "Shopping Cart"
            }, {
                Emoji: "&#x1F3E7",
                Title: "ATM Sign"
            }, {
                Emoji: "&#x1F6AE",
                Title: "Litter In Bin Sign"
            }, {
                Emoji: "&#x1F6B0",
                Title: "Potable Water"
            }, {
                Emoji: "&#x267F",
                Title: "Wheelchair Symbol"
            }, {
                Emoji: "&#x1F6B9",
                Title: "Men’s Room"
            }, {
                Emoji: "&#x1F6BA",
                Title: "Women’s Room"
            }, {
                Emoji: "&#x1F6BB",
                Title: "Restroom"
            }, {
                Emoji: "&#x1F6BC",
                Title: "Baby Symbol"
            }, {
                Emoji: "&#x1F6BE",
                Title: "Water Closet"
            }, {
                Emoji: "&#x1F6C2",
                Title: "Passport Control"
            }, {
                Emoji: "&#x1F6C3",
                Title: "Customs"
            }, {
                Emoji: "&#x1F6C4",
                Title: "Baggage Claim"
            }, {
                Emoji: "&#x1F6C5",
                Title: "Left Luggage"
            }, {
                Emoji: "&#x26A0",
                Title: "Warning"
            }, {
                Emoji: "&#x1F6B8",
                Title: "Children Crossing"
            }, {
                Emoji: "&#x26D4",
                Title: "No Entry"
            }, {
                Emoji: "&#x1F6AB",
                Title: "Prohibited"
            }, {
                Emoji: "&#x1F6B3",
                Title: "No Bicycles"
            }, {
                Emoji: "&#x1F6AD",
                Title: "No Smoking"
            }, {
                Emoji: "&#x1F6AF",
                Title: "No Littering"
            }, {
                Emoji: "&#x1F6B1",
                Title: "Non-Potable Water"
            }, {
                Emoji: "&#x1F6B7",
                Title: "No Pedestrians"
            }, {
                Emoji: "&#x1F4F5",
                Title: "No Mobile Phones"
            }, {
                Emoji: "&#x1F51E",
                Title: "No One Under Eighteen"
            }, {
                Emoji: "&#x2622",
                Title: "Radioactive"
            }, {
                Emoji: "&#x2623",
                Title: "Biohazard"
            }, {
                Emoji: "&#x2B06",
                Title: "Up Arrow"
            }, {
                Emoji: "&#x2197",
                Title: "Up-Right Arrow"
            }, {
                Emoji: "&#x27A1",
                Title: "Right Arrow"
            }, {
                Emoji: "&#x2198",
                Title: "Down-Right Arrow"
            }, {
                Emoji: "&#x2B07",
                Title: "Down Arrow"
            }, {
                Emoji: "&#x2199",
                Title: "Down-Left Arrow"
            }, {
                Emoji: "&#x2B05",
                Title: "Left Arrow"
            }, {
                Emoji: "&#x2196",
                Title: "Up-Left Arrow"
            }, {
                Emoji: "&#x2195",
                Title: "Up-Down Arrow"
            }, {
                Emoji: "&#x2194",
                Title: "Left-Right Arrow"
            }, {
                Emoji: "&#x21A9",
                Title: "Right Arrow Curving Left"
            }, {
                Emoji: "&#x21AA",
                Title: "Left Arrow Curving Right"
            }, {
                Emoji: "&#x2934",
                Title: "Right Arrow Curving Up"
            }, {
                Emoji: "&#x2935",
                Title: "Right Arrow Curving Down"
            }, {
                Emoji: "&#x1F503",
                Title: "Clockwise Vertical Arrows"
            }, {
                Emoji: "&#x1F504",
                Title: "Anticlockwise Arrows Button"
            }, {
                Emoji: "&#x1F519",
                Title: "BACK Arrow"
            }, {
                Emoji: "&#x1F51A",
                Title: "END Arrow"
            }, {
                Emoji: "&#x1F51B",
                Title: "ON! Arrow"
            }, {
                Emoji: "&#x1F51C",
                Title: "SOON Arrow"
            }, {
                Emoji: "&#x1F51D",
                Title: "TOP Arrow"
            }, {
                Emoji: "&#x1F6D0",
                Title: "Place Of Worship"
            }, {
                Emoji: "&#x269B",
                Title: "Atom Symbol"
            }, {
                Emoji: "&#x1F549",
                Title: "Om"
            }, {
                Emoji: "&#x2721",
                Title: "Star Of David"
            }, {
                Emoji: "&#x2638",
                Title: "Wheel Of Dharma"
            }, {
                Emoji: "&#x262F",
                Title: "Yin Yang"
            }, {
                Emoji: "&#x271D",
                Title: "Latin Cross"
            }, {
                Emoji: "&#x2626",
                Title: "Orthodox Cross"
            }, {
                Emoji: "&#x262A",
                Title: "Star And Crescent"
            }, {
                Emoji: "&#x262E",
                Title: "Peace Symbol"
            }, {
                Emoji: "&#x1F54E",
                Title: "Menorah"
            }, {
                Emoji: "&#x1F52F",
                Title: "Dotted Six-Pointed Star"
            }, {
                Emoji: "&#x2648",
                Title: "Aries"
            }, {
                Emoji: "&#x2649",
                Title: "Taurus"
            }, {
                Emoji: "&#x264A",
                Title: "Gemini"
            }, {
                Emoji: "&#x264B",
                Title: "Cancer"
            }, {
                Emoji: "&#x264C",
                Title: "Leo"
            }, {
                Emoji: "&#x264D",
                Title: "Virgo"
            }, {
                Emoji: "&#x264E",
                Title: "Libra"
            }, {
                Emoji: "&#x264F",
                Title: "Scorpius"
            }, {
                Emoji: "&#x2650",
                Title: "Sagittarius"
            }, {
                Emoji: "&#x2651",
                Title: "Capricorn"
            }, {
                Emoji: "&#x2652",
                Title: "Aquarius"
            }, {
                Emoji: "&#x2653",
                Title: "Pisces"
            }, {
                Emoji: "&#x26CE",
                Title: "Ophiuchus"
            }, {
                Emoji: "&#x1F500",
                Title: "Shuffle Tracks Button"
            }, {
                Emoji: "&#x1F501",
                Title: "Repeat Button"
            }, {
                Emoji: "&#x1F502",
                Title: "Repeat Single Button"
            }, {
                Emoji: "&#x25B6",
                Title: "Play Button"
            }, {
                Emoji: "&#x23E9",
                Title: "Fast-Forward Button"
            }, {
                Emoji: "&#x23ED",
                Title: "Next Track Button"
            }, {
                Emoji: "&#x23EF",
                Title: "Play Or Pause Button"
            }, {
                Emoji: "&#x25C0",
                Title: "Reverse Button"
            }, {
                Emoji: "&#x23EA",
                Title: "Fast Reverse Button"
            }, {
                Emoji: "&#x23EE",
                Title: "Last Track Button"
            }, {
                Emoji: "&#x1F53C",
                Title: "Up Button"
            }, {
                Emoji: "&#x23EB",
                Title: "Fast Up Button"
            }, {
                Emoji: "&#x1F53D",
                Title: "Down Button"
            }, {
                Emoji: "&#x23EC",
                Title: "Fast Down Button"
            }, {
                Emoji: "&#x23F8",
                Title: "Pause Button"
            }, {
                Emoji: "&#x23F9",
                Title: "Stop Button"
            }, {
                Emoji: "&#x23FA",
                Title: "Record Button"
            }, {
                Emoji: "&#x23CF",
                Title: "Eject Button"
            }, {
                Emoji: "&#x1F3A6",
                Title: "Cinema"
            }, {
                Emoji: "&#x1F505",
                Title: "Dim Button"
            }, {
                Emoji: "&#x1F506",
                Title: "Bright Button"
            }, {
                Emoji: "&#x1F4F6",
                Title: "Antenna Bars"
            }, {
                Emoji: "&#x1F4F3",
                Title: "Vibration Mode"
            }, {
                Emoji: "&#x1F4F4",
                Title: "Mobile Phone Off"
            }, {
                Emoji: "&#x267B",
                Title: "Recycling Symbol"
            }, {
                Emoji: "&#x1F4DB",
                Title: "Name Badge"
            }, {
                Emoji: "&#x269C",
                Title: "Fleur-De-Lis"
            }, {
                Emoji: "&#x1F530",
                Title: "Japanese Symbol For Beginner"
            }, {
                Emoji: "&#x1F531",
                Title: "Trident Emblem"
            }, {
                Emoji: "&#x2B55",
                Title: "Heavy Large Circle"
            }, {
                Emoji: "&#x2705",
                Title: "White Heavy Check Mark"
            }, {
                Emoji: "&#x2611",
                Title: "Ballot Box With Check"
            }, {
                Emoji: "&#x2714",
                Title: "Heavy Check Mark"
            }, {
                Emoji: "&#x2716",
                Title: "Heavy Multiplication X"
            }, {
                Emoji: "&#x274C",
                Title: "Cross Mark"
            }, {
                Emoji: "&#x274E",
                Title: "Cross Mark Button"
            }, {
                Emoji: "&#x2795",
                Title: "Heavy Plus Sign"
            }, {
                Emoji: "&#x2640",
                Title: "Female Sign"
            }, {
                Emoji: "&#x2642",
                Title: "Male Sign"
            }, {
                Emoji: "&#x2695",
                Title: "Medical Symbol"
            }, {
                Emoji: "&#x2796",
                Title: "Heavy Minus Sign"
            }, {
                Emoji: "&#x2797",
                Title: "Heavy Division Sign"
            }, {
                Emoji: "&#x27B0",
                Title: "Curly Loop"
            }, {
                Emoji: "&#x27BF",
                Title: "Double Curly Loop"
            }, {
                Emoji: "&#x303D",
                Title: "Part Alternation Mark"
            }, {
                Emoji: "&#x2733",
                Title: "Eight-Spoked Asterisk"
            }, {
                Emoji: "&#x2734",
                Title: "Eight-Pointed Star"
            }, {
                Emoji: "&#x2747",
                Title: "Sparkle"
            }, {
                Emoji: "&#x203C",
                Title: "Double Exclamation Mark"
            }, {
                Emoji: "&#x2049",
                Title: "Exclamation Question Mark"
            }, {
                Emoji: "&#x2753",
                Title: "Question Mark"
            }, {
                Emoji: "&#x2754",
                Title: "White Question Mark"
            }, {
                Emoji: "&#x2755",
                Title: "White Exclamation Mark"
            }, {
                Emoji: "&#x2757",
                Title: "Exclamation Mark"
            }, {
                Emoji: "&#x3030",
                Title: "Wavy Dash"
            }, {
                Emoji: "&#x00A9",
                Title: "Copyright"
            }, {
                Emoji: "&#x00AE",
                Title: "Registered"
            }, {
                Emoji: "&#x2122",
                Title: "Trade Mark"
            }, {
                Emoji: "&#x0023&#xFE0F&#x20E3",
                Title: "Keycap: #"
            }, {
                Emoji: "&#x002A&#xFE0F&#x20E3",
                Title: "Keycap: *"
            }, {
                Emoji: "&#x0030&#xFE0F&#x20E3",
                Title: "Keycap: 0"
            }, {
                Emoji: "&#x0031&#xFE0F&#x20E3",
                Title: "Keycap: 1"
            }, {
                Emoji: "&#x0032&#xFE0F&#x20E3",
                Title: "Keycap: 2"
            }, {
                Emoji: "&#x0033&#xFE0F&#x20E3",
                Title: "Keycap: 3"
            }, {
                Emoji: "&#x0034&#xFE0F&#x20E3",
                Title: "Keycap: 4"
            }, {
                Emoji: "&#x0035&#xFE0F&#x20E3",
                Title: "Keycap: 5"
            }, {
                Emoji: "&#x0036&#xFE0F&#x20E3",
                Title: "Keycap: 6"
            }, {
                Emoji: "&#x0037&#xFE0F&#x20E3",
                Title: "Keycap: 7"
            }, {
                Emoji: "&#x0038&#xFE0F&#x20E3",
                Title: "Keycap: 8"
            }, {
                Emoji: "&#x0039&#xFE0F&#x20E3",
                Title: "Keycap: 9"
            }, {
                Emoji: "&#x1F51F",
                Title: "Keycap 10"
            }, {
                Emoji: "&#x1F4AF",
                Title: "Hundred Points"
            }, {
                Emoji: "&#x1F520",
                Title: "Input Latin Uppercase"
            }, {
                Emoji: "&#x1F521",
                Title: "Input Latin Lowercase"
            }, {
                Emoji: "&#x1F522",
                Title: "Input Numbers"
            }, {
                Emoji: "&#x1F523",
                Title: "Input Symbols"
            }, {
                Emoji: "&#x1F524",
                Title: "Input Latin Letters"
            }, {
                Emoji: "&#x1F170",
                Title: "A Button (blood Type)"
            }, {
                Emoji: "&#x1F18E",
                Title: "AB Button (blood Type)"
            }, {
                Emoji: "&#x1F171",
                Title: "B Button (blood Type)"
            }, {
                Emoji: "&#x1F191",
                Title: "CL Button"
            }, {
                Emoji: "&#x1F192",
                Title: "COOL Button"
            }, {
                Emoji: "&#x1F193",
                Title: "FREE Button"
            }, {
                Emoji: "&#x2139",
                Title: "Information"
            }, {
                Emoji: "&#x1F194",
                Title: "ID Button"
            }, {
                Emoji: "&#x24C2",
                Title: "Circled M"
            }, {
                Emoji: "&#x1F195",
                Title: "NEW Button"
            }, {
                Emoji: "&#x1F196",
                Title: "NG Button"
            }, {
                Emoji: "&#x1F17E",
                Title: "O Button (blood Type)"
            }, {
                Emoji: "&#x1F197",
                Title: "OK Button"
            }, {
                Emoji: "&#x1F17F",
                Title: "P Button"
            }, {
                Emoji: "&#x1F198",
                Title: "SOS Button"
            }, {
                Emoji: "&#x1F199",
                Title: "UP! Button"
            }, {
                Emoji: "&#x1F19A",
                Title: "VS Button"
            }, {
                Emoji: "&#x1F201",
                Title: "Japanese “here” Button"
            }, {
                Emoji: "&#x1F202",
                Title: "Japanese “service Charge” Button"
            }, {
                Emoji: "&#x1F237",
                Title: "Japanese “monthly Amount” Button"
            }, {
                Emoji: "&#x1F236",
                Title: "Japanese “not Free Of Charge” Button"
            }, {
                Emoji: "&#x1F22F",
                Title: "Japanese “reserved” Button"
            }, {
                Emoji: "&#x1F250",
                Title: "Japanese “bargain” Button"
            }, {
                Emoji: "&#x1F239",
                Title: "Japanese “discount” Button"
            }, {
                Emoji: "&#x1F21A",
                Title: "Japanese “free Of Charge” Button"
            }, {
                Emoji: "&#x1F232",
                Title: "Japanese “prohibited” Button"
            }, {
                Emoji: "&#x1F251",
                Title: "Japanese “acceptable” Button"
            }, {
                Emoji: "&#x1F238",
                Title: "Japanese “application” Button"
            }, {
                Emoji: "&#x1F234",
                Title: "Japanese “passing Grade” Button"
            }, {
                Emoji: "&#x1F233",
                Title: "Japanese “vacancy” Button"
            }, {
                Emoji: "&#x3297",
                Title: "Japanese “congratulations” Button"
            }, {
                Emoji: "&#x3299",
                Title: "Japanese “secret” Button"
            }, {
                Emoji: "&#x1F23A",
                Title: "Japanese “open For Business” Button"
            }, {
                Emoji: "&#x1F235",
                Title: "Japanese “no Vacancy” Button"
            }, {
                Emoji: "&#x25AA",
                Title: "Black Small Square"
            }, {
                Emoji: "&#x25AB",
                Title: "White Small Square"
            }, {
                Emoji: "&#x25FB",
                Title: "White Medium Square"
            }, {
                Emoji: "&#x25FC",
                Title: "Black Medium Square"
            }, {
                Emoji: "&#x25FD",
                Title: "White Medium-Small Square"
            }, {
                Emoji: "&#x25FE",
                Title: "Black Medium-Small Square"
            }, {
                Emoji: "&#x2B1B",
                Title: "Black Large Square"
            }, {
                Emoji: "&#x2B1C",
                Title: "White Large Square"
            }, {
                Emoji: "&#x1F536",
                Title: "Large Orange Diamond"
            }, {
                Emoji: "&#x1F537",
                Title: "Large Blue Diamond"
            }, {
                Emoji: "&#x1F538",
                Title: "Small Orange Diamond"
            }, {
                Emoji: "&#x1F539",
                Title: "Small Blue Diamond"
            }, {
                Emoji: "&#x1F53A",
                Title: "Red Triangle Pointed Up"
            }, {
                Emoji: "&#x1F53B",
                Title: "Red Triangle Pointed Down"
            }, {
                Emoji: "&#x1F4A0",
                Title: "Diamond With A Dot"
            }, {
                Emoji: "&#x1F518",
                Title: "Radio Button"
            }, {
                Emoji: "&#x1F532",
                Title: "Black Square Button"
            }, {
                Emoji: "&#x1F533",
                Title: "White Square Button"
            }, {
                Emoji: "&#x26AA",
                Title: "White Circle"
            }, {
                Emoji: "&#x26AB",
                Title: "Black Circle"
            }, {
                Emoji: "&#x1F534",
                Title: "Red Circle"
            }, {
                Emoji: "&#x1F535",
                Title: "Blue Circle"
            }, {
                Emoji: "&#x1F3C1",
                Title: "Chequered Flag"
            }, {
                Emoji: "&#x1F6A9",
                Title: "Triangular Flag"
            }, {
                Emoji: "&#x1F38C",
                Title: "Crossed Flags"
            }, {
                Emoji: "&#x1F3F4",
                Title: "Black Flag"
            }, {
                Emoji: "&#x1F3F3",
                Title: "White Flag"
            }, {
                Emoji: "&#x1F3F3&#xFE0F&#x200D&#x1F308",
                Title: "Rainbow Flag"
            }, {
                Emoji: "&#x1F1E6&#x1F1E8",
                Title: "Ascension Island"
            }, {
                Emoji: "&#x1F1E6&#x1F1E9",
                Title: "Andorra"
            }, {
                Emoji: "&#x1F1E6&#x1F1EA",
                Title: "United Arab Emirates"
            }, {
                Emoji: "&#x1F1E6&#x1F1EB",
                Title: "Afghanistan"
            }, {
                Emoji: "&#x1F1E6&#x1F1EC",
                Title: "Antigua & Barbuda"
            }, {
                Emoji: "&#x1F1E6&#x1F1EE",
                Title: "Anguilla"
            }, {
                Emoji: "&#x1F1E6&#x1F1F1",
                Title: "Albania"
            }, {
                Emoji: "&#x1F1E6&#x1F1F2",
                Title: "Armenia"
            }, {
                Emoji: "&#x1F1E6&#x1F1F4",
                Title: "Angola"
            }, {
                Emoji: "&#x1F1E6&#x1F1F6",
                Title: "Antarctica"
            }, {
                Emoji: "&#x1F1E6&#x1F1F7",
                Title: "Argentina"
            }, {
                Emoji: "&#x1F1E6&#x1F1F8",
                Title: "American Samoa"
            }, {
                Emoji: "&#x1F1E6&#x1F1F9",
                Title: "Austria"
            }, {
                Emoji: "&#x1F1E6&#x1F1FA",
                Title: "Australia"
            }, {
                Emoji: "&#x1F1E6&#x1F1FC",
                Title: "Aruba"
            }, {
                Emoji: "&#x1F1E6&#x1F1FD",
                Title: "Åland Islands"
            }, {
                Emoji: "&#x1F1E6&#x1F1FF",
                Title: "Azerbaijan"
            }, {
                Emoji: "&#x1F1E7&#x1F1E6",
                Title: "Bosnia & Herzegovina"
            }, {
                Emoji: "&#x1F1E7&#x1F1E7",
                Title: "Barbados"
            }, {
                Emoji: "&#x1F1E7&#x1F1E9",
                Title: "Bangladesh"
            }, {
                Emoji: "&#x1F1E7&#x1F1EA",
                Title: "Belgium"
            }, {
                Emoji: "&#x1F1E7&#x1F1EB",
                Title: "Burkina Faso"
            }, {
                Emoji: "&#x1F1E7&#x1F1EC",
                Title: "Bulgaria"
            }, {
                Emoji: "&#x1F1E7&#x1F1ED",
                Title: "Bahrain"
            }, {
                Emoji: "&#x1F1E7&#x1F1EE",
                Title: "Burundi"
            }, {
                Emoji: "&#x1F1E7&#x1F1EF",
                Title: "Benin"
            }, {
                Emoji: "&#x1F1E7&#x1F1F1",
                Title: "St. Barthélemy"
            }, {
                Emoji: "&#x1F1E7&#x1F1F2",
                Title: "Bermuda"
            }, {
                Emoji: "&#x1F1E7&#x1F1F3",
                Title: "Brunei"
            }, {
                Emoji: "&#x1F1E7&#x1F1F4",
                Title: "Bolivia"
            }, {
                Emoji: "&#x1F1E7&#x1F1F6",
                Title: "Caribbean Netherlands"
            }, {
                Emoji: "&#x1F1E7&#x1F1F7",
                Title: "Brazil"
            }, {
                Emoji: "&#x1F1E7&#x1F1F8",
                Title: "Bahamas"
            }, {
                Emoji: "&#x1F1E7&#x1F1F9",
                Title: "Bhutan"
            }, {
                Emoji: "&#x1F1E7&#x1F1FB",
                Title: "Bouvet Island"
            }, {
                Emoji: "&#x1F1E7&#x1F1FC",
                Title: "Botswana"
            }, {
                Emoji: "&#x1F1E7&#x1F1FE",
                Title: "Belarus"
            }, {
                Emoji: "&#x1F1E7&#x1F1FF",
                Title: "Belize"
            }, {
                Emoji: "&#x1F1E8&#x1F1E6",
                Title: "Canada"
            }, {
                Emoji: "&#x1F1E8&#x1F1E8",
                Title: "Cocos (Keeling) Islands"
            }, {
                Emoji: "&#x1F1E8&#x1F1E9",
                Title: "Congo - Kinshasa"
            }, {
                Emoji: "&#x1F1E8&#x1F1EB",
                Title: "Central African Republic"
            }, {
                Emoji: "&#x1F1E8&#x1F1EC",
                Title: "Congo - Brazzaville"
            }, {
                Emoji: "&#x1F1E8&#x1F1ED",
                Title: "Switzerland"
            }, {
                Emoji: "&#x1F1E8&#x1F1EE",
                Title: "Côte D’Ivoire"
            }, {
                Emoji: "&#x1F1E8&#x1F1F0",
                Title: "Cook Islands"
            }, {
                Emoji: "&#x1F1E8&#x1F1F1",
                Title: "Chile"
            }, {
                Emoji: "&#x1F1E8&#x1F1F2",
                Title: "Cameroon"
            }, {
                Emoji: "&#x1F1E8&#x1F1F3",
                Title: "China"
            }, {
                Emoji: "&#x1F1E8&#x1F1F4",
                Title: "Colombia"
            }, {
                Emoji: "&#x1F1E8&#x1F1F5",
                Title: "Clipperton Island"
            }, {
                Emoji: "&#x1F1E8&#x1F1F7",
                Title: "Costa Rica"
            }, {
                Emoji: "&#x1F1E8&#x1F1FA",
                Title: "Cuba"
            }, {
                Emoji: "&#x1F1E8&#x1F1FB",
                Title: "Cape Verde"
            }, {
                Emoji: "&#x1F1E8&#x1F1FC",
                Title: "Curaçao"
            }, {
                Emoji: "&#x1F1E8&#x1F1FD",
                Title: "Christmas Island"
            }, {
                Emoji: "&#x1F1E8&#x1F1FE",
                Title: "Cyprus"
            }, {
                Emoji: "&#x1F1E8&#x1F1FF",
                Title: "Czech Republic"
            }, {
                Emoji: "&#x1F1E9&#x1F1EA",
                Title: "Germany"
            }, {
                Emoji: "&#x1F1E9&#x1F1EC",
                Title: "Diego Garcia"
            }, {
                Emoji: "&#x1F1E9&#x1F1EF",
                Title: "Djibouti"
            }, {
                Emoji: "&#x1F1E9&#x1F1F0",
                Title: "Denmark"
            }, {
                Emoji: "&#x1F1E9&#x1F1F2",
                Title: "Dominica"
            }, {
                Emoji: "&#x1F1E9&#x1F1F4",
                Title: "Dominican Republic"
            }, {
                Emoji: "&#x1F1E9&#x1F1FF",
                Title: "Algeria"
            }, {
                Emoji: "&#x1F1EA&#x1F1E6",
                Title: "Ceuta & Melilla"
            }, {
                Emoji: "&#x1F1EA&#x1F1E8",
                Title: "Ecuador"
            }, {
                Emoji: "&#x1F1EA&#x1F1EA",
                Title: "Estonia"
            }, {
                Emoji: "&#x1F1EA&#x1F1EC",
                Title: "Egypt"
            }, {
                Emoji: "&#x1F1EA&#x1F1ED",
                Title: "Western Sahara"
            }, {
                Emoji: "&#x1F1EA&#x1F1F7",
                Title: "Eritrea"
            }, {
                Emoji: "&#x1F1EA&#x1F1F8",
                Title: "Spain"
            }, {
                Emoji: "&#x1F1EA&#x1F1F9",
                Title: "Ethiopia"
            }, {
                Emoji: "&#x1F1EA&#x1F1FA",
                Title: "European Union"
            }, {
                Emoji: "&#x1F1EB&#x1F1EE",
                Title: "Finland"
            }, {
                Emoji: "&#x1F1EB&#x1F1EF",
                Title: "Fiji"
            }, {
                Emoji: "&#x1F1EB&#x1F1F0",
                Title: "Falkland Islands"
            }, {
                Emoji: "&#x1F1EB&#x1F1F2",
                Title: "Micronesia"
            }, {
                Emoji: "&#x1F1EB&#x1F1F4",
                Title: "Faroe Islands"
            }, {
                Emoji: "&#x1F1EB&#x1F1F7",
                Title: "France"
            }, {
                Emoji: "&#x1F1EC&#x1F1E6",
                Title: "Gabon"
            }, {
                Emoji: "&#x1F1EC&#x1F1E7",
                Title: "United Kingdom"
            }, {
                Emoji: "&#x1F1EC&#x1F1E9",
                Title: "Grenada"
            }, {
                Emoji: "&#x1F1EC&#x1F1EA",
                Title: "Georgia"
            }, {
                Emoji: "&#x1F1EC&#x1F1EB",
                Title: "French Guiana"
            }, {
                Emoji: "&#x1F1EC&#x1F1EC",
                Title: "Guernsey"
            }, {
                Emoji: "&#x1F1EC&#x1F1ED",
                Title: "Ghana"
            }, {
                Emoji: "&#x1F1EC&#x1F1EE",
                Title: "Gibraltar"
            }, {
                Emoji: "&#x1F1EC&#x1F1F1",
                Title: "Greenland"
            }, {
                Emoji: "&#x1F1EC&#x1F1F2",
                Title: "Gambia"
            }, {
                Emoji: "&#x1F1EC&#x1F1F3",
                Title: "Guinea"
            }, {
                Emoji: "&#x1F1EC&#x1F1F5",
                Title: "Guadeloupe"
            }, {
                Emoji: "&#x1F1EC&#x1F1F6",
                Title: "Equatorial Guinea"
            }, {
                Emoji: "&#x1F1EC&#x1F1F7",
                Title: "Greece"
            }, {
                Emoji: "&#x1F1EC&#x1F1F8",
                Title: "South Georgia & South Sandwich Islands"
            }, {
                Emoji: "&#x1F1EC&#x1F1F9",
                Title: "Guatemala"
            }, {
                Emoji: "&#x1F1EC&#x1F1FA",
                Title: "Guam"
            }, {
                Emoji: "&#x1F1EC&#x1F1FC",
                Title: "Guinea-Bissau"
            }, {
                Emoji: "&#x1F1EC&#x1F1FE",
                Title: "Guyana"
            }, {
                Emoji: "&#x1F1ED&#x1F1F0",
                Title: "Hong Kong SAR China"
            }, {
                Emoji: "&#x1F1ED&#x1F1F2",
                Title: "Heard & McDonald Islands"
            }, {
                Emoji: "&#x1F1ED&#x1F1F3",
                Title: "Honduras"
            }, {
                Emoji: "&#x1F1ED&#x1F1F7",
                Title: "Croatia"
            }, {
                Emoji: "&#x1F1ED&#x1F1F9",
                Title: "Haiti"
            }, {
                Emoji: "&#x1F1ED&#x1F1FA",
                Title: "Hungary"
            }, {
                Emoji: "&#x1F1EE&#x1F1E8",
                Title: "Canary Islands"
            }, {
                Emoji: "&#x1F1EE&#x1F1E9",
                Title: "Indonesia"
            }, {
                Emoji: "&#x1F1EE&#x1F1EA",
                Title: "Ireland"
            }, {
                Emoji: "&#x1F1EE&#x1F1F1",
                Title: "Israel"
            }, {
                Emoji: "&#x1F1EE&#x1F1F2",
                Title: "Isle Of Man"
            }, {
                Emoji: "&#x1F1EE&#x1F1F3",
                Title: "India"
            }, {
                Emoji: "&#x1F1EE&#x1F1F4",
                Title: "British Indian Ocean Territory"
            }, {
                Emoji: "&#x1F1EE&#x1F1F6",
                Title: "Iraq"
            }, {
                Emoji: "&#x1F1EE&#x1F1F7",
                Title: "Iran"
            }, {
                Emoji: "&#x1F1EE&#x1F1F8",
                Title: "Iceland"
            }, {
                Emoji: "&#x1F1EE&#x1F1F9",
                Title: "Italy"
            }, {
                Emoji: "&#x1F1EF&#x1F1EA",
                Title: "Jersey"
            }, {
                Emoji: "&#x1F1EF&#x1F1F2",
                Title: "Jamaica"
            }, {
                Emoji: "&#x1F1EF&#x1F1F4",
                Title: "Jordan"
            }, {
                Emoji: "&#x1F1EF&#x1F1F5",
                Title: "Japan"
            }, {
                Emoji: "&#x1F1F0&#x1F1EA",
                Title: "Kenya"
            }, {
                Emoji: "&#x1F1F0&#x1F1EC",
                Title: "Kyrgyzstan"
            }, {
                Emoji: "&#x1F1F0&#x1F1ED",
                Title: "Cambodia"
            }, {
                Emoji: "&#x1F1F0&#x1F1EE",
                Title: "Kiribati"
            }, {
                Emoji: "&#x1F1F0&#x1F1F2",
                Title: "Comoros"
            }, {
                Emoji: "&#x1F1F0&#x1F1F3",
                Title: "St. Kitts & Nevis"
            }, {
                Emoji: "&#x1F1F0&#x1F1F5",
                Title: "North Korea"
            }, {
                Emoji: "&#x1F1F0&#x1F1F7",
                Title: "South Korea"
            }, {
                Emoji: "&#x1F1F0&#x1F1FC",
                Title: "Kuwait"
            }, {
                Emoji: "&#x1F1F0&#x1F1FE",
                Title: "Cayman Islands"
            }, {
                Emoji: "&#x1F1F0&#x1F1FF",
                Title: "Kazakhstan"
            }, {
                Emoji: "&#x1F1F1&#x1F1E6",
                Title: "Laos"
            }, {
                Emoji: "&#x1F1F1&#x1F1E7",
                Title: "Lebanon"
            }, {
                Emoji: "&#x1F1F1&#x1F1E8",
                Title: "St. Lucia"
            }, {
                Emoji: "&#x1F1F1&#x1F1EE",
                Title: "Liechtenstein"
            }, {
                Emoji: "&#x1F1F1&#x1F1F0",
                Title: "Sri Lanka"
            }, {
                Emoji: "&#x1F1F1&#x1F1F7",
                Title: "Liberia"
            }, {
                Emoji: "&#x1F1F1&#x1F1F8",
                Title: "Lesotho"
            }, {
                Emoji: "&#x1F1F1&#x1F1F9",
                Title: "Lithuania"
            }, {
                Emoji: "&#x1F1F1&#x1F1FA",
                Title: "Luxembourg"
            }, {
                Emoji: "&#x1F1F1&#x1F1FB",
                Title: "Latvia"
            }, {
                Emoji: "&#x1F1F1&#x1F1FE",
                Title: "Libya"
            }, {
                Emoji: "&#x1F1F2&#x1F1E6",
                Title: "Morocco"
            }, {
                Emoji: "&#x1F1F2&#x1F1E8",
                Title: "Monaco"
            }, {
                Emoji: "&#x1F1F2&#x1F1E9",
                Title: "Moldova"
            }, {
                Emoji: "&#x1F1F2&#x1F1EA",
                Title: "Montenegro"
            }, {
                Emoji: "&#x1F1F2&#x1F1EB",
                Title: "St. Martin"
            }, {
                Emoji: "&#x1F1F2&#x1F1EC",
                Title: "Madagascar"
            }, {
                Emoji: "&#x1F1F2&#x1F1ED",
                Title: "Marshall Islands"
            }, {
                Emoji: "&#x1F1F2&#x1F1F0",
                Title: "Macedonia"
            }, {
                Emoji: "&#x1F1F2&#x1F1F1",
                Title: "Mali"
            }, {
                Emoji: "&#x1F1F2&#x1F1F2",
                Title: "Myanmar (Burma)"
            }, {
                Emoji: "&#x1F1F2&#x1F1F3",
                Title: "Mongolia"
            }, {
                Emoji: "&#x1F1F2&#x1F1F4",
                Title: "Macau SAR China"
            }, {
                Emoji: "&#x1F1F2&#x1F1F5",
                Title: "Northern Mariana Islands"
            }, {
                Emoji: "&#x1F1F2&#x1F1F6",
                Title: "Martinique"
            }, {
                Emoji: "&#x1F1F2&#x1F1F7",
                Title: "Mauritania"
            }, {
                Emoji: "&#x1F1F2&#x1F1F8",
                Title: "Montserrat"
            }, {
                Emoji: "&#x1F1F2&#x1F1F9",
                Title: "Malta"
            }, {
                Emoji: "&#x1F1F2&#x1F1FA",
                Title: "Mauritius"
            }, {
                Emoji: "&#x1F1F2&#x1F1FB",
                Title: "Maldives"
            }, {
                Emoji: "&#x1F1F2&#x1F1FC",
                Title: "Malawi"
            }, {
                Emoji: "&#x1F1F2&#x1F1FD",
                Title: "Mexico"
            }, {
                Emoji: "&#x1F1F2&#x1F1FE",
                Title: "Malaysia"
            }, {
                Emoji: "&#x1F1F2&#x1F1FF",
                Title: "Mozambique"
            }, {
                Emoji: "&#x1F1F3&#x1F1E6",
                Title: "Namibia"
            }, {
                Emoji: "&#x1F1F3&#x1F1E8",
                Title: "New Caledonia"
            }, {
                Emoji: "&#x1F1F3&#x1F1EA",
                Title: "Niger"
            }, {
                Emoji: "&#x1F1F3&#x1F1EB",
                Title: "Norfolk Island"
            }, {
                Emoji: "&#x1F1F3&#x1F1EC",
                Title: "Nigeria"
            }, {
                Emoji: "&#x1F1F3&#x1F1EE",
                Title: "Nicaragua"
            }, {
                Emoji: "&#x1F1F3&#x1F1F1",
                Title: "Netherlands"
            }, {
                Emoji: "&#x1F1F3&#x1F1F4",
                Title: "Norway"
            }, {
                Emoji: "&#x1F1F3&#x1F1F5",
                Title: "Nepal"
            }, {
                Emoji: "&#x1F1F3&#x1F1F7",
                Title: "Nauru"
            }, {
                Emoji: "&#x1F1F3&#x1F1FA",
                Title: "Niue"
            }, {
                Emoji: "&#x1F1F3&#x1F1FF",
                Title: "New Zealand"
            }, {
                Emoji: "&#x1F1F4&#x1F1F2",
                Title: "Oman"
            }, {
                Emoji: "&#x1F1F5&#x1F1E6",
                Title: "Panama"
            }, {
                Emoji: "&#x1F1F5&#x1F1EA",
                Title: "Peru"
            }, {
                Emoji: "&#x1F1F5&#x1F1EB",
                Title: "French Polynesia"
            }, {
                Emoji: "&#x1F1F5&#x1F1EC",
                Title: "Papua New Guinea"
            }, {
                Emoji: "&#x1F1F5&#x1F1ED",
                Title: "Philippines"
            }, {
                Emoji: "&#x1F1F5&#x1F1F0",
                Title: "Pakistan"
            }, {
                Emoji: "&#x1F1F5&#x1F1F1",
                Title: "Poland"
            }, {
                Emoji: "&#x1F1F5&#x1F1F2",
                Title: "St. Pierre & Miquelon"
            }, {
                Emoji: "&#x1F1F5&#x1F1F3",
                Title: "Pitcairn Islands"
            }, {
                Emoji: "&#x1F1F5&#x1F1F7",
                Title: "Puerto Rico"
            }, {
                Emoji: "&#x1F1F5&#x1F1F8",
                Title: "Palestinian Territories"
            }, {
                Emoji: "&#x1F1F5&#x1F1F9",
                Title: "Portugal"
            }, {
                Emoji: "&#x1F1F5&#x1F1FC",
                Title: "Palau"
            }, {
                Emoji: "&#x1F1F5&#x1F1FE",
                Title: "Paraguay"
            }, {
                Emoji: "&#x1F1F6&#x1F1E6",
                Title: "Qatar"
            }, {
                Emoji: "&#x1F1F7&#x1F1EA",
                Title: "Réunion"
            }, {
                Emoji: "&#x1F1F7&#x1F1F4",
                Title: "Romania"
            }, {
                Emoji: "&#x1F1F7&#x1F1F8",
                Title: "Serbia"
            }, {
                Emoji: "&#x1F1F7&#x1F1FA",
                Title: "Russia"
            }, {
                Emoji: "&#x1F1F7&#x1F1FC",
                Title: "Rwanda"
            }, {
                Emoji: "&#x1F1F8&#x1F1E6",
                Title: "Saudi Arabia"
            }, {
                Emoji: "&#x1F1F8&#x1F1E7",
                Title: "Solomon Islands"
            }, {
                Emoji: "&#x1F1F8&#x1F1E8",
                Title: "Seychelles"
            }, {
                Emoji: "&#x1F1F8&#x1F1E9",
                Title: "Sudan"
            }, {
                Emoji: "&#x1F1F8&#x1F1EA",
                Title: "Sweden"
            }, {
                Emoji: "&#x1F1F8&#x1F1EC",
                Title: "Singapore"
            }, {
                Emoji: "&#x1F1F8&#x1F1ED",
                Title: "St. Helena"
            }, {
                Emoji: "&#x1F1F8&#x1F1EE",
                Title: "Slovenia"
            }, {
                Emoji: "&#x1F1F8&#x1F1EF",
                Title: "Svalbard & Jan Mayen"
            }, {
                Emoji: "&#x1F1F8&#x1F1F0",
                Title: "Slovakia"
            }, {
                Emoji: "&#x1F1F8&#x1F1F1",
                Title: "Sierra Leone"
            }, {
                Emoji: "&#x1F1F8&#x1F1F2",
                Title: "San Marino"
            }, {
                Emoji: "&#x1F1F8&#x1F1F3",
                Title: "Senegal"
            }, {
                Emoji: "&#x1F1F8&#x1F1F4",
                Title: "Somalia"
            }, {
                Emoji: "&#x1F1F8&#x1F1F7",
                Title: "Suriname"
            }, {
                Emoji: "&#x1F1F8&#x1F1F8",
                Title: "South Sudan"
            }, {
                Emoji: "&#x1F1F8&#x1F1F9",
                Title: "São Tomé & Príncipe"
            }, {
                Emoji: "&#x1F1F8&#x1F1FB",
                Title: "El Salvador"
            }, {
                Emoji: "&#x1F1F8&#x1F1FD",
                Title: "Sint Maarten"
            }, {
                Emoji: "&#x1F1F8&#x1F1FE",
                Title: "Syria"
            }, {
                Emoji: "&#x1F1F8&#x1F1FF",
                Title: "Swaziland"
            }, {
                Emoji: "&#x1F1F9&#x1F1E6",
                Title: "Tristan Da Cunha"
            }, {
                Emoji: "&#x1F1F9&#x1F1E8",
                Title: "Turks & Caicos Islands"
            }, {
                Emoji: "&#x1F1F9&#x1F1E9",
                Title: "Chad"
            }, {
                Emoji: "&#x1F1F9&#x1F1EB",
                Title: "French Southern Territories"
            }, {
                Emoji: "&#x1F1F9&#x1F1EC",
                Title: "Togo"
            }, {
                Emoji: "&#x1F1F9&#x1F1ED",
                Title: "Thailand"
            }, {
                Emoji: "&#x1F1F9&#x1F1EF",
                Title: "Tajikistan"
            }, {
                Emoji: "&#x1F1F9&#x1F1F0",
                Title: "Tokelau"
            }, {
                Emoji: "&#x1F1F9&#x1F1F1",
                Title: "Timor-Leste"
            }, {
                Emoji: "&#x1F1F9&#x1F1F2",
                Title: "Turkmenistan"
            }, {
                Emoji: "&#x1F1F9&#x1F1F3",
                Title: "Tunisia"
            }, {
                Emoji: "&#x1F1F9&#x1F1F4",
                Title: "Tonga"
            }, {
                Emoji: "&#x1F1F9&#x1F1F7",
                Title: "Turkey"
            }, {
                Emoji: "&#x1F1F9&#x1F1F9",
                Title: "Trinidad & Tobago"
            }, {
                Emoji: "&#x1F1F9&#x1F1FB",
                Title: "Tuvalu"
            }, {
                Emoji: "&#x1F1F9&#x1F1FC",
                Title: "Taiwan"
            }, {
                Emoji: "&#x1F1F9&#x1F1FF",
                Title: "Tanzania"
            }, {
                Emoji: "&#x1F1FA&#x1F1E6",
                Title: "Ukraine"
            }, {
                Emoji: "&#x1F1FA&#x1F1EC",
                Title: "Uganda"
            }, {
                Emoji: "&#x1F1FA&#x1F1F2",
                Title: "U.S. Outlying Islands"
            }, {
                Emoji: "&#x1F1FA&#x1F1F3",
                Title: "United Nations"
            }, {
                Emoji: "&#x1F1FA&#x1F1F8",
                Title: "United States"
            }, {
                Emoji: "&#x1F1FA&#x1F1FE",
                Title: "Uruguay"
            }, {
                Emoji: "&#x1F1FA&#x1F1FF",
                Title: "Uzbekistan"
            }, {
                Emoji: "&#x1F1FB&#x1F1E6",
                Title: "Vatican City"
            }, {
                Emoji: "&#x1F1FB&#x1F1E8",
                Title: "St. Vincent & Grenadines"
            }, {
                Emoji: "&#x1F1FB&#x1F1EA",
                Title: "Venezuela"
            }, {
                Emoji: "&#x1F1FB&#x1F1EC",
                Title: "British Virgin Islands"
            }, {
                Emoji: "&#x1F1FB&#x1F1EE",
                Title: "U.S. Virgin Islands"
            }, {
                Emoji: "&#x1F1FB&#x1F1F3",
                Title: "Vietnam"
            }, {
                Emoji: "&#x1F1FB&#x1F1FA",
                Title: "Vanuatu"
            }, {
                Emoji: "&#x1F1FC&#x1F1EB",
                Title: "Wallis & Futuna"
            }, {
                Emoji: "&#x1F1FC&#x1F1F8",
                Title: "Samoa"
            }, {
                Emoji: "&#x1F1FD&#x1F1F0",
                Title: "Kosovo"
            }, {
                Emoji: "&#x1F1FE&#x1F1EA",
                Title: "Yemen"
            }, {
                Emoji: "&#x1F1FE&#x1F1F9",
                Title: "Mayotte"
            }, {
                Emoji: "&#x1F1FF&#x1F1E6",
                Title: "South Africa"
            }, {
                Emoji: "&#x1F1FF&#x1F1F2",
                Title: "Zambia"
            }]
    };
    for (I = 0, N = CFH.Items.length; I < N; ++I) {
        addCFHItem(CFH.Items[I], CFH);
    }
    CFH.TextArea.addEventListener("paste", function(Event) {
        var Value;
        if (GM_getValue("CFH_ALIPF")) {
            Value = Event.clipboardData.getData("text/plain");
            if (Value.match(/^https?:/)) {
                Event.preventDefault();
                wrapCFHLinkImage(CFH, "", Value, Value.match(/\.(jpg|jpeg|gif|bmp|png)/) ? true : false);
            }
        }
    });
}

function wrapCFHLinkImage(CFH, Title, URL, Image) {
    var Start, End, Value;
    Start = CFH.TextArea.selectionStart;
    End = CFH.TextArea.selectionEnd;
    Value = (Image ? "!" : "") + "[" + Title + "](" + URL + ")";
    CFH.TextArea.value = CFH.TextArea.value.slice(0, Start) + Value + CFH.TextArea.value.slice(End);
    CFH.TextArea.setSelectionRange(End + Value.length, End + Value.length);
    CFH.TextArea.focus();
}

function insertCFHTableRows(N, Table) {
    while (N > 0) {
        insertCFHTableRow(Table);
        --N;
    }
}

function insertCFHTableRow(Table) {
    var N, Row, I, J, Delete;
    N = Table.rows.length;
    Row = Table.insertRow(N);
    for (I = 0, J = Table.rows[0].cells.length - 1; I < J; ++I) {
        Row.insertCell(0).innerHTML = "<input placeholder=\"Value\" type=\"text\"/>";
    }
    Delete = Row.insertCell(0);
    if (N > 2) {
        Delete.innerHTML =
            "<a>" +
            "    <i class=\"fa fa-times-circle\" title=\"Delete row.\"></i>" +
            "</a>";
        Delete.firstElementChild.addEventListener("click", function() {
            if (Table.rows.length > 4) {
                Row.remove();
            } else {
                window.alert("A table must have a least one row and two columns.");
            }
        });
    }
}

function insertCFHTableColumns(N, Table) {
    while (N > 0) {
        insertCFHTableColumn(Table);
        --N;
    }
}

function insertCFHTableColumn(Table) {
    var Rows, N, I, J, Delete, Column;
    Rows = Table.rows;
    N = Rows[0].cells.length;
    for (I = 3, J = Rows.length; I < J; ++I) {
        Rows[I].insertCell(N).innerHTML = "<input placeholder=\"Value\" type=\"text\"/>";
    }
    Rows[2].insertCell(N).innerHTML =
        "<select>" +
        "    <option value=\":-\">Left</option>" +
        "    <option value=\":-:\">Center</option>" +
        "    <option value=\"-:\">Right</option>" +
        "</select>";
    Delete = Rows[0].insertCell(N);
    Delete.innerHTML =
        "<a>" +
        "    <i class=\"fa fa-times-circle\" title=\"Delete column.\"></i>" +
        "</a>";
    Column = Rows[1].insertCell(N);
    Column.innerHTML = "<input placeholder=\"Header\" type=\"text\"/>";
    Delete.firstElementChild.addEventListener("click", function() {
        Rows = Table.rows;
        N = Rows[1].cells.length;
        if (N > 3) {
            do {
                --N;
            } while (Rows[1].cells[N] != Column);
            for (I = 0, J = Rows.length; I < J; ++I) {
                Rows[I].deleteCell(N);
            }
        } else {
            window.alert("A table must have at least one row and two columns.");
        }
    });
}

function setCFHEmojis(Emojis, CFH) {
    var I, N;
    for (I = 0, N = Emojis.children.length; I < N; ++I) {
        Emojis.children[I].addEventListener("click", function(Event) {
            wrapCFHFormat(CFH, Event.currentTarget.textContent);
        });
    }
}

function addCFHItem(Item, CFH) {
    var Context, Button, Popout;
    if ((Item.ID && GM_getValue(Item.ID)) || !Item.ID) {
        CFH.Panel.insertAdjacentHTML(
            "beforeEnd",
            "<span>" +
            "    <a class=\"page_heading_btn\" title=\"" + Item.Name + "\">" +
            "        <i class=\"fa " + Item.Icon + "\"></i>" + (Item.SecondaryIcon ? (
                "    <i class=\"fa " + Item.SecondaryIcon + "\"></i>") : "") + (Item.Text ? (
                "    <span>" + Item.Text + "</span") : "") +
            "    </a>" +
            "</span>"
        );
        Context = CFH.Panel.lastElementChild;
        Button = Context.firstElementChild;
        if (Item.setPopout) {
            Popout = createPopout(Context);
            Popout.Popout.classList.add("CFHPopout");
            Popout.customRule = function(Target) {
                return !Button.contains(Target);
            };
            Item.setPopout(Popout.Popout);
            Button.addEventListener("click", function() {
                if (Popout.Popout.classList.contains("rhHidden")) {
                    Popout.popOut(Button, Item.Callback);
                } else {
                    Popout.Popout.classList.add("rhHidden");
                }
            });
        } else if (Item.setPopup) {
            var popup = createPopup();
            popup.Icon.classList.add(`fa-table`);
            popup.Title.textContent = `Add a table:`;
            Item.setPopup(popup);
            Button.addEventListener("click", function() {
                popup.popUp();
            });
        } else {
            if (Item.Callback) {
                Item.Callback(Context);
            }
            Context.addEventListener("click", function() {
                if (Item.OnClick) {
                    Item.OnClick();
                } else {
                    wrapCFHFormat(CFH, Item.Prefix, Item.Suffix, Item.OrderedList, Item.UnorderedList);
                }
            });
        }
    }
}

function wrapCFHFormat(CFH, Prefix, Suffix, OrderedList, UnorderedList) {
    var Value, Start, End, N;
    Value = CFH.TextArea.value;
    Start = CFH.TextArea.selectionStart;
    End = CFH.TextArea.selectionEnd;
    if (OrderedList || UnorderedList) {
        if (OrderedList) {
            N = 1;
            Prefix = N + ". " + Value.slice(Start, End).replace(/\n/g, function() {
                return ("\n" + (++N) + ". ");
            });
        } else {
            Prefix = "* " + Value.slice(Start, End).replace(/\n/g, "\n* ");
        }
    }
    CFH.TextArea.value = Value.slice(0, Start) + Prefix + ((OrderedList || UnorderedList) ? "" : (Value.slice(Start, End) + (Suffix ? Suffix : ""))) + Value.slice(End);
    CFH.TextArea.setSelectionRange(End + Prefix.length, End + Prefix.length);
    CFH.TextArea.focus();
}

function setCFHALIPF(CFH, Value) {
    if (typeof Value == "undefined") {
        Value = GM_getValue("CFH_ALIPF") ? false : true;
        GM_setValue("CFH_ALIPF", Value);
    }
    if (Value) {
        CFH.ALIPF.title = "Automatic Links / Images Paste Formatting: On";
        CFH.ALIPF.classList.remove("CFHALIPF");
    } else {
        CFH.ALIPF.title = "Automatic Links / Images Paste Formatting: Off";
        CFH.ALIPF.classList.add("CFHALIPF");
    }
}
