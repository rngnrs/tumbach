var Tools = require("./tools");

module.exports = function(tr) {
    tr = tr || {};
    var translate = function(sourceText, disambiguation) {
        tr[disambiguation] = Tools.translate(sourceText, disambiguation);
    };
    translate("Markup", "toMarkupPageText");
    translate("Home", "toHomePageText");
    translate("Framed version", "framedVersionText");
    translate("Version without frame", "normalVersionText");
    translate("F.A.Q.", "toFaqPageText");
    translate("Management", "toManagePageText");
    translate("Hide by image", "hideByImageText");
    translate("Hide by image hash", "hideByImageHashText");
    translate("Hide by image size", "hideByImageSizeText");
    translate("Draw on this image", "drawOnImageText");
    translate("Reply", "toThread");
    translate("Replies:", "referencedByText");
    translate("Fixed", "fixedText");
    translate("The thread is closed", "closedText");
    translate("To drafts", "addToDraftsText");
    translate("This user is registered", "registeredText");
    translate("Post limit reached", "postLimitReachedText");
    translate("Bump limit reached", "bumpLimitReachedText");
    translate("Quick reply", "quickReplyText");
    translate("Actions", "postActionsText");
    translate("Edit", "editPostText");
    translate("Fix", "fixThreadText");
    translate("Unfix", "unfixThreadText");
    translate("Close", "closeThreadText");
    translate("Open", "openThreadText");
    translate("Move", "moveThreadText");
    translate("Show IP", "showUserIpText");
    translate("Ban", "banUserText");
    translate("Download all files", "downloadThreadFilesText");
    translate("Add to favorites", "addThreadToFavoritesText");
    translate("Remove thread from favorites", "removeThreadFromFavoritesText");
    translate("Delete", "deletePostText");
    translate("Hide", "hidePostText");
    translate("Show", "showPostText");
    translate("Add radio stream", "addRadioText");
    translate("Minimize player", "minimizePlayerText");
    translate("Maximize player", "maximizePlayerText");
    translate("Play", "playerPlayText");
    translate("Pause", "playerPauseText");
    translate("Previous track", "playerPreviousTrackText");
    translate("Next track", "playerNextTrackText");
    translate("Mute", "playerMuteText");
    translate("Unmute", "playerUnmuteText");
    translate("Title:", "playerRadioTitleLabelText");
    translate("URL:", "playerRadioURLLabelText");
    translate("Last modified:", "modificationDateTimeText");
    translate("User was banned for this post", "bannedForText");
    translate("Delete file", "deleteFileText");
    translate("Edit file rating", "editFileRatingText");
    translate("Find source...", "findSourceText");
    translate("Edit audio file tags", "editAudioTagsText");
    translate("Add to playlist", "addToPlaylistText");
    translate("Borad rules", "boardRulesLinkText");
    translate("Threads catalog", "boardCatalogLinkText");
    translate("Thread archive", "boardArchiveLinkText");
    translate("RSS feed", "boardRssLinkText");
    translate("Posting is disabled at this board", "postingDisabledBoardText");
    translate("Posting is disabled in this thread", "postingDisabledThreadText");
    translate("Previous page", "toPreviousPageText");
    translate("Next page", "toNextPageText");
    translate("Posting speed:", "postingSpeedText");
    translate("Posts omitted:", "omittedPostsText");
    translate("files omitted:", "omittedFilesText");
    translate("Scroll to the top", "toTopText");
    translate("Scroll to the bottom", "toBottomText");
    translate("Search: possible +required -excluded", "searchInputPlaceholder");
    translate("All boards", "allBoardsText");
    translate("Search", "searchButtonText");
    translate("Settings", "settingsButtonText");
    translate("Favorites", "showFavoritesText");
    translate("Mum is watching me!", "mumWatchingText");
    translate("Log out", "logoutText");
    translate("Log in", "loginText");
    translate("Password/hashpass", "loginPlaceholderText");
    translate("Show password", "showPasswordText");
    translate("Previous page/file", "hotkeyPreviousPageImageLabelText");
    translate("Next page/file", "hotkeyNextPageImageLabelText");
    translate("Previous thread (on board)/post (in thread)", "hotkeyPreviousThreadPostLabelText");
    translate("Next thread (on board)/post (in thread)", "hotkeyNextThreadPostLabelText");
    translate("Previous post (in thread/on board)", "hotkeyPreviousPostLabelText");
    translate("Next post (inthread/on board)", "hotkeyNextPostLabelText");
    translate("Hide post/thread", "hotkeyHidePostLabelText");
    translate("Hide similar", "hideSimilarPostsText");
    translate("Go to thread", "hotkeyGoToThreadLabelText");
    translate("Expand thread", "hotkeyExpandThreadLabelText");
    translate("Expand post file", "hotkeyExpandImageLabelText");
    translate("Quick reply", "hotkeyQuickReplyLabelText");
    translate("Submit reply", "hotkeySubmitReplyLabelText");
    translate("Show favorite threads", "hotkeyShowFavoritesLabelText");
    translate("Show settings", "hotkeyShowSettingsLabelText");
    translate("Update thread (in thread only)", "hotkeyUpdateThreadLabelText");
    translate("Bold text", "hotkeyMarkupBoldLabelText");
    translate("Italics", "hotkeyMarkupItalicsLabelText");
    translate("Striked out text", "hotkeyMarkupStrikedOutLabelText");
    translate("Underlined text", "hotkeyMarkupUnderlinedLabelText");
    translate("Spoiler", "hotkeyMarkupSpoilerLabelText");
    translate("Quote selected text", "hotkeyMarkupQuotationLabelText");
    translate("Code block", "hotkeyMarkupCodeLabelText");
    translate("Style:", "styleLabelText");
    translate("Code style:", "codeStyleLabelText");
    translate("Shrink posts", "postShrinkingLabelText");
    translate("Use WebSockets", "useWebSocketsLabelText");
    translate("Sticky toolbar", "stickyToolbarLabelText");
    translate("Time:", "timeLabelText");
    translate("Device type:", "deviceTypeLabelText");
    translate("Detect automatically", "deviceTypeAutoText");
    translate("Desktop", "deviceTypeDesktopText");
    translate("Mobile", "deviceTypeMobileText");
    translate("Server", "timeServerText");
    translate("Local", "timeLocalText");
    translate("Offset:", "timeZoneOffsetLabelText");
    translate("Captcha:", "captchaLabelText");
    translate("Maximum rating:", "maxAllowedRatingLabelText");
    translate("Hide postform rules", "hidePostformRulesLabelText");
    translate("Minimalistic post form", "minimalisticPostformLabelText");
    translate("Hide boards:", "hiddenBoardsLabelText");
    translate("This option may be ignored on some boards", "captchaLabelWarningText");
    translate("General", "generalTabText");
    translate("Posts and threads", "postsTabText");
    translate("Files", "filesTabText");
    translate("Postform and posting", "postformTabText");
    translate("Hiding", "hidingTabText");
    translate("Other", "otherTabText");
    translate("Bans", "bansTabText");
    translate("Users", "usersTabText");
    translate("Content", "contentTabText");
    translate("Auto update threads by default", "autoUpdateThreadsByDefaultLabelText");
    translate("Auto update interval (sec):", "autoUpdateIntervalLabelText");
    translate("Show desktop notifications", "showAutoUpdateDesktopNotificationsLabelText");
    translate("Play sound", "playAutoUpdateSoundLabelText");
    translate("Expand long posts on click", "addExpanderLabelText");
    translate("Mark OP post links", "signOpPostLinksLabelText");
    translate("Mark own post links", "signOwnPostLinksLabelText");
    translate("Post preview appearance delay (ms):", "viewPostPreviewDelayLabelText");
    translate("Post preview disappearance delay (ms):", "hidePostPreviewDelayLabelText");
    translate("Show file leaf buttons", "showLeafButtonsLabelText");
    translate("Leaf through images only", "leafThroughImagesOnlyLabelText");
    translate("Image zoom sensitivity:", "imageZoomSensitivityLabelText");
    translate("Default volume:", "defaultAudioVideoVolumeLabelText");
    translate("Remember", "rememberAudioVideoVolumeLabelText");
    translate("Play media immediately", "playAudioVideoImmediatelyLabelText");
    translate("Loop media", "loopAudioVideoLabelText");
    translate("Quick reply outside thread:", "quickReplyActionLabelText");
    translate("Redirects to thread", "quickReplyActionGotoThreadText");
    translate("Appends a new post", "quickReplyActionAppendPostText");
    translate("Move to post after replying in thread", "moveToPostOnReplyInThreadLabelText");
    translate("Check if attached file exists on server", "checkFileExistenceLabelText");
    translate("Show previews when attaching files", "showAttachedFilePreviewLabelText");
    translate("Add thread to favorites on reply", "addToFavoritesOnReplyLabelText");
    translate("Hide postform markup", "hidePostformMarkupLabelText");
    translate("Strip EXIF from JPEG files", "stripExifFromJpegLabelText");
    translate("Hide tripcodes", "hideTripcodesLabelText");
    translate("Hide user names", "hideUserNamesLabelText");
    translate("Strike out links to hidden posts", "strikeOutHiddenPostLinksLabelText");
    translate("Spells (command-based post hiding)", "spellsLabelText");
    translate("Edit spells", "editSpellsText");
    translate("Show hidden post list", "showHiddenPostListText");
    translate("Maximum simultaneous AJAX requests:", "maxSimultaneousAjaxLabelText");
    translate("New post count near board names", "showNewPostsLabelText");
    translate("Hotkeys enabled", "hotkeysLabelText");
    translate("User CSS enabled", "userCssLabelText");
    translate("User JavaScript enabled", "userJavaScriptLabelText");
    translate("Edit", "editHotkeysText");
    translate("Edit", "editUserCssText");
    translate("Edit", "editUserJavaScriptText");
    translate("Cancel", "cancelButtonText");
    translate("Confirm", "confirmButtonText");
    translate("Show post form", "showPostFormText");
    translate("Hide post form", "hidePostFormText");
    translate("E-mail", "postFormPlaceholderEmail");
    translate("Submit", "postFormButtonSubmit");
    translate("E-mail:", "postFormLabelEmail");
    translate("Name", "postFormPlaceholderName");
    translate("Name:", "postFormLabelName");
    translate("Subject", "postFormPlaceholderSubject");
    translate("Subject:", "postFormLabelSubject");
    translate("Comment. Max length:", "postFormTextPlaceholder");
    translate("Post:", "postFormLabelText");
    translate("Bold text", "markupBold");
    translate("Italics", "markupItalics");
    translate("Striked out text", "markupStrikedOut");
    translate("Underlined text", "markupUnderlined");
    translate("Spoiler", "markupSpoiler");
    translate("Quote selected text", "markupQuotation");
    translate("Code block syntax", "markupCodeLang");
    translate("Code block", "markupCode");
    translate("Subscript", "markupSubscript");
    translate("Superscript", "markupSuperscript");
    translate("URL (external link)", "markupUrl");
    translate("Unordered list", "markupUnorderedList");
    translate("Ordered list", "markupOrderedList");
    translate("List item", "markupListItem");
    translate("Raw HTML", "markupHtml");
    translate("Inline LaTeX", "markupInlineLatex");
    translate("LaTeX", "markupLatex");
    translate("Markup mode:", "postFormLabelMarkupMode");
    translate("Options:", "postFormLabelOptions");
    translate("OP", "postFormLabelSignAsOp");
    translate("Tripcode", "postFormLabelTripcode");
    translate("File(s):", "postFormInputFile");
    translate("Select file", "selectFileText");
    translate("Remove this file", "removeFileText");
    translate("Rating:", "ratingLabelText");
    translate("Specify file URL", "attachFileByLinkText");
    translate("Specify file by drawing or draw on attached image", "attachFileByDrawingText");
    translate("Specify Vkontakte audio file", "attachFileByVkText");
    translate("Password", "postFormPlaceholderPassword");
    translate("Password:", "postFormLabelPassword");
    translate("Captcha:", "postFormLabelCaptcha");
    translate("You don't have to enter captcha", "noCaptchaText");
    translate("Posts left:", "captchaQuotaText");
    translate("Show rules", "showPostformRulesText");
    translate("Hide rules", "hidePostformRulesText");
    translate("The login systyem does NOT store any data on the server. "
        + "It only stores a cookie on your PC to allow post deleting, etc. without "
        + "entering password every time.<br />"
        + "It is also used for moderator/administrator authentication.", "loginSystemDescriptionText");
    translate("When logging in with Vkontakte, you may omit the login, "
        + "but to be logged in with the same login on each browser, you have to specify it.<br />"
        + "When logged in with Vkontakte, you are able to attach your VK audio.<br />"
        + "This does not affect your anonymity in any way (the files are downloaded by the server "
        + "and no links to your VK page are shown).", "loginSystemVkontakteDescriptionText");
    translate("SFW - safe for work (no socially condemned content)\n"
        + "R-15 - restricted for 15 years (contains ecchi, idols, violence)\n"
        + "R-18 - restricted for 18 years (genitalis, coitus, offensive religious/racist/nationalist content)\n"
        + "R-18G - restricted for 18 years, guidance advised "
        + "(shemale, death, guro, scat, defecation, urination, etc.)", "ratingTooltip");
    translate("Welcome. Again.", "welcomeMessage");
    translate("Our friends", "friendsHeader");
    translate("News", "newsHeader");
    translate("Rules", "rulesHeader");
    translate("Back", "backText");
    translate("Update thread", "updateThreadText");
    translate("Auto update", "autoUpdateText");
    translate("Go", "goText");
    translate("Sort by:", "sortingModeLabelText");
    translate("Creation date", "sortingModeDateLabelText");
    translate("Last post date", "sortingModeRecentLabelText");
    translate("Bump count", "sortingModeBumpsLabelText");
    translate("Reply count:", "replyCountLabelText");
    translate("New posts:", "newPostsText");
    translate("No new posts", "noNewPostsText");
    translate("kbps", "kbps");
    translate("Download file", "downloadPlaylistFileText");
    translate("Remove from playlist", "removeFromPlaylistText");
    translate("URL:", "linkLabelText");
    translate("This file exists on server. It will NOT be uploaded, but WILL be copied.", "fileExistsOnServerText");
    translate("Selected file is too large", "fileTooLargeWarningText");
    translate("MB", "megabytesText");
    translate("KB", "kilobytesText");
    translate("Byte(s)", "bytesText");
    translate("Album:", "audioTagAlbumText");
    translate("Artist:", "audioTagArtistText");
    translate("Title:", "audioTagTitleText");
    translate("Year:", "audioTagYearText");
    translate("posting is restricted (read-only access)", "postingRestrictedtext");
    translate("reading and posting are restricted", "readingAndPostingRestrictedtext");
    translate("Not banned", "banLevelNoneDescription");
    translate("Posting prohibited", "banLevelReadOnlyDescription");
    translate("Posting and reading prohibited", "banLevelNoAccessDescription");
    translate("No level", "accessLevelNoneDescription");
    translate("User", "accessLevelUserDescription");
    translate("Moderator", "accessLevelModerDescription");
    translate("Administrator", "accessLevelAdminDescription");
    translate("Expires:", "banExpiresLabelText");
    translate("Reason:", "banReasonLabelText");
    translate("Delete all user posts on boards:", "delallHeaderText");
    translate("All", "selectAllText");
    translate("Ban reason", "editBanReasonText");
    translate("Board:", "banBoardLabelText");
    translate("Ban level:", "banLevelLabelText");
    translate("Ban date:", "banDateTimeLabelText");
    translate("Source text", "postSourceText");
    translate("Expand video", "expandVideoText");
    translate("Collapse video", "collapseVideoText");
    translate("Favorite threads", "favoriteThreadsText");
    translate("Auto update", "autoUpdateText");
    translate("Remove", "removeButtonText");
    translate("Close", "closeButtonText");
    translate("Export", "exportSettingsButtonText");
    translate("Import", "importSettingsButtonText");
    translate("Remove from hidden post/thread list", "removeFromHiddenPostListText");
    translate("Hidden posts/threads", "hiddenPostListText");
    translate("Settings", "settingsDialogTitle");
    translate("Drawing", "drawingDialogTitle");
    translate("Save the drawing", "saveDrawingButtonText");
    translate("If password is empty, current hashpass will be used", "enterPasswordText");
    translate("Enter password", "enterPasswordTitle");
    translate("Add files", "addFilesText");
    translate("Show markup", "showPostformMarkupText");
    translate("Hide markup", "hidePostformMarkupText");
    translate("Target board", "targetBoardLabelText");
    translate("Select a track", "selectTrackTitle");
    translate("Chat privately", "chatWithUserText");
    translate("Highlight code (page reload required)", "sourceHighlightingLabelText");
    translate("Enable private chat", "chatLabelText");
    translate("Enable drawing tools", "drawingLabelText");
    translate("Update player automatically", "autoUpdatePlayerLabelText");
    translate("Private chat", "chatText");
    translate("New private message", "newChatMessageText");
    translate("Send", "sendChatMessageButtonText");
    translate("Delete this chat", "deleteChatButtonText");
    translate("Loading threads...", "loadingThreadsMessage");
    translate("Loading posts...", "loadingPostsMessage");
    translate("Searching for posts...", "searchingMessage");
    translate("Loading bans...", "loadingBansMessage");
    translate("Loading users...", "loadingUsersMessage");
    translate("Close voting", "closeVotingText");
    translate("Open voting", "openVotingText");
    translate("Tripcode activated for THIS THREAD only", "threadTripcodeActivatedText");
    translate("Tripcode deactivated for THIS THREAD only", "threadTripcodeDeactivatedText");
    translate("Global tripcode activated. Uncheck tripcode option OUTSIDE THREAD to disable it",
        "globalTripcodeActivatedText");
    translate("Global tripcode deactivated (except threads where it is activated explicitly)",
        "globalTripcodeDeactivatedText");
    translate("Close files only by clicking on them", "closeFilesByClickingOnlyLabelText");
    translate("Drafts", "draftsText");
    translate("Fill form with this draft", "fillFormWithDraftText");
    translate("Delete this draft", "deleteDraftText");
    translate("Show drafts", "showDraftsText");
    translate("Hide drafts", "hideDraftsText");
    translate("Expand", "expandThreadText");
    translate("Collapse", "collapseThreadText");
    translate("Redirecting to thread...", "redirectingToThreadText");
    translate("YouTube and Coub video embedding", "youtubeCoubEmbeddingMarkup");
    translate("Vkontakte posts embedding", "vkontakteEmbeddingMarkup");
    translate("Twitter twits embedding", "twitterEmbeddingMarkup");
    translate("becomes", "becomesText");
    translate("Previous file", "previousFileText");
    translate("Next file", "nextFileText");
    translate("You are banned", "bannedText");
    translate("never", "banExpiresNeverText");
    translate("Clear date field", "clearDateFieldText");
    translate("logged in as superuser", "loginMessageSuperuserText");
    translate("logged in as administrator", "loginMessageAdminText");
    translate("logged in as moderator", "loginMessageModerText");
    translate("logged in as user", "loginMessageUserText");
    translate("not registered", "loginMessageNoneText");
    translate("Boards", "boardsText");
    translate("Nothing found", "nothingFoundMessage");
    translate("Search results", "searchResultsMessage");
    translate("Unknown error", "errorUnknownText");
    translate("No connection with server", "error0Text");
    translate("Bad request", "error400Text");
    translate("Not found", "error404Text");
    translate("Request timeout", "error408Text");
    translate("Request entity too large", "error413Text");
    translate("Temporarily banned (DDoS detected)", "error429Text");
    translate("Internal server error", "error500Text");
    translate("Bad gateway", "error502Text");
    translate("Service unavailable", "error503Text");
    translate("Gateway timeout", "error504Text");
    translate("CloudFlare: server is returning an unknown error", "error520Text");
    translate("CloudFlare: server is down", "error521Text");
    translate("CloudFlare: connection timed out", "error522Text");
    translate("CloudFlare: server is unreachable", "error523Text");
    translate("CloudFlare: a timeout occured", "error524Text");
    translate("CloudFlare: SSL handshake failed", "error525Text");
    translate("CloudFlare: invalid SSL certificate", "error526Text");
    translate("Unexpected end of token list", "unexpectedEndOfTokenListErrorText");
    translate("Failed to generate hash", "failedToGenerateHashErrorText");
    translate("The thread is already in favorites", "alreadyInFavoritesErrorText");
    translate("Invalid arguments", "invalidArgumentsErrorText");
    translate("No such token in the table", "noTokenInTableErrorText");
    translate("The thread was deleted", "threadDeletedErrorText");
    translate("Invalid data", "invalidDataErrorText");
    translate("No such post", "noSuchPostErrorText");
    translate("Internal error", "internalErrorText");
    translate("Enable API request caching", "apiRequestCachingLabelText");
    translate("Copy settings string and save it somewhere", "copySettingsHint");
    translate("Paste settings string here", "pasteSettingsHint");
    translate("Enter your message here", "chatMessageTextPlaceholder");
    translate("Allow bumping", "setThreadBumpableText");
    translate("Disallow bumping", "setThreadUnbumpableText");
    translate("Use this button to jump between boards", "boardSelectTooltip");
    translate("Banners mode:", "bannersModeLabelText");
    translate("Show random board banner", "bannersModeRandomText");
    translate("Show current board banner", "bannersModeSameText");
    translate("Do not show banners", "bannersModeNoneText");
    translate("This thread is archived. Posting is disabled", "archivedThreadText");
    translate("Synchronize", "synchronizationText");
    translate("Synchronize settings", "synchronizeSettingsLabelText");
    translate("Synchronize CSS and JS", "synchronizeCssAndJsLabelText");
    translate("Synchronize password", "synchronizePasswordLabelText");
    translate("Show", "showPasswordButtonText");
    translate("Hide", "hidePasswordButtonText");
    translate("New", "newPasswordButtonText");
    translate("No password specified, and not logged in", "noPasswordNotLoggedInError");
    translate("Synchronization data will be available within 5 minutes", "synchronizationTimeoutText");
    translate("Synchronization completed successfully", "synchronizationSuccessfulText");
    translate("Post", "postMenuCategoryPostText");
    translate("Thread", "postMenuCategoryThreadText");
    translate("User", "postMenuCategoryUserText");
    translate("Your browser can not play files of this type", "unsupportedMediaTypeText");
    translate("New ban...", "newBanText");
    translate("New user...", "newUserText");
    translate("Hashpass:", "hashpassLabelText");
    translate("Generate hashpass", "generateHashpassButtonText");
    translate("Are you sure?", "confirmationText");
    translate("Background type:", "canvasBackgroundTypeLabelText");
    translate("Drawable", "checkboxBackgroundDrawableLabel");
    translate("Not drawable", "checkboxBackgroundNotDrawableLabel");
    translate("Dimensions:", "canvasDimensionsLabelText");
    translate("0 — determine automatically", "canvasDimensionsDescriptionText");
    translate("Background color:", "canvasBackgroundColorLabelText");
    translate("Drawing options", "drawingOptionsDialogTitle");
    translate("Auto", "canvasBackgroundAutoSizeButtonText");
    translate("Drawing is disabled. Enable it in the \"Other\" tab of the settings dialog "
        + "(the \"Enable drawing tools\" checkbox).", "drawingDisabledWarningText");
    translate("Reset image scale on every opening", "resetFileScaleOnOpeningLabelText");
    translate("Default", "dafaultCanvasBackgroundColorButtonText");
    translate("Show full text", "expandPostTextText");
    translate("Collapse text", "collapsePostTextText");
    translate("Current directory:", "currentDirectoryLabelText");
    translate("Current file:", "currentFileLabelText");
    translate("Frequently used files", "frequentlyUsedFilesLabelText");
    translate("Add file", "addFileButtonText");
    translate("Add directory", "addDirectoryButtonText");
    translate("Rename directory", "renameDirectoryButtonText");
    translate("Delete directory", "deleteDirectoryButtonText");
    translate("Download file", "downloadFileButtonText");
    translate("Edit file", "editFileButtonText");
    translate("Rename file", "renameFileButtonText");
    translate("Delete file", "deleteFileButtonText");
    translate("Adding file", "addFileDialogTitle");
    translate("Adding directory", "addDirectoryDialogTitle");
    translate("Renaming file", "renameFileDialogTitle");
    translate("Renaming directory", "renameDirectoryDialogTitle");
    translate("Deleting file", "deleteFileDialogTitle");
    translate("Deleting directory", "deleteDirectoryDialogTitle");
    translate("File name:", "fileNameLabelText");
    translate("File:", "fileLabelText");
    translate("Directory name:", "directoryNameLabelText");
    translate("Server actions", "serverActionLabelText");
    translate("Connection with the server will be lost, and the server will become unavailable for some time. "
        + "You will have to reload the page manually.", "reloadWarningText");
    translate("Regenerate cache", "regenerateCacheButtonText");
    translate("Rerender posts", "rerenderPostsButtonText");
    translate("Rebuild post search index", "rebuildSearchIndexButtonText");
    translate("Reload boards", "reloadBoardsButtonText");
    translate("Reload config", "reloadConfigButtonText");
    translate("Reload templates", "reloadTemplatesButtonText");
    translate("Reload everything", "reloadAllButtonText");
    translate("Image similarity:", "ihashDistanceLabelText");
    translate("Infinite scroll", "infiniteScrollLabelText");
    translate("Page", "pageText");
    translate("Regenerate archived threads", "regenerateArchivedThreadsLabelText");
    translate("Show search field", "showSearchActionText");
    translate("Start dragging to make post form float", "postFormHeaderLabelText");
    translate("Fixed", "postFormFixedButtonText");
    translate("Not fixed", "postFormUnfixedButtonText");
    translate("Close", "closePostFormButtonText");

    translate("Failed to prepare captcha", "failedToPrepareCaptchaText");
    translate("Transparent header", "transparentHeaderLabelText");
    translate("Show markup modes into the post form", "showMarkupModesLabelText");
    translate("Animated effects", "animatedEffectsText");
    return tr;
};
