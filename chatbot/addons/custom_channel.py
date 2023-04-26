import asyncio
import inspect
from sanic import Sanic, Blueprint, response
from sanic.request import Request
from sanic.response import HTTPResponse
from typing import Text, Dict, Any, Optional, Callable, Awaitable, NoReturn

import rasa.utils.endpoints
from rasa.core.channels.channel import (
    InputChannel,
    CollectingOutputChannel,
    UserMessage,
)

from rasa.core.channels import TelegramInput

from logging import getLogger
from sanic import Blueprint, response
from sanic.request import Request
from sanic.response import HTTPResponse
from telebot import TeleBot
from telebot.apihelper import ApiTelegramException
from telebot.types import (
    InlineKeyboardButton,
    Update,
    InlineKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardMarkup,
    Message,
)

logger = getLogger()
from rasa.shared.constants import INTENT_MESSAGE_PREFIX
from rasa.shared.core.constants import USER_INTENT_RESTART

class MyIO(TelegramInput):

    @classmethod
    def name(cls) -> Text:
        return "MyIO"

    def blueprint(
        self, on_new_message: Callable[[UserMessage], Awaitable[Any]]
    ) -> Blueprint:
        tg_webhook = Blueprint("tg_webhook", __name__)
        out_channel = self.get_output_channel()

        @tg_webhook.route("/", methods=["GET"])
        async def health(_: Request) -> HTTPResponse:
            return response.json({"status": "ok"})

        @tg_webhook.route("/set_webhook", methods=["GET", "POST"])
        async def set_webhook(_: Request) -> HTTPResponse:
            s = out_channel.setWebhook(self.webhook_url)
            if s:
                logger.info("Webhook Setup Successful")
                return response.text("Webhook setup successful")
            else:
                logger.warning("Webhook Setup Failed")
                return response.text("Invalid webhook")

        @tg_webhook.route("/webhook", methods=["GET", "POST"])
        async def message(request: Request) -> Any:
            if request.method == "POST":
                try:
                    sender_id = None
                    request_dict = request.json
                    update = Update.de_json(request_dict)
                    if not out_channel.get_me().username == self.verify:
                        logger.debug(f"{__file__}: Invalid access token, check it matches Telegram")
                        return response.text("failed")

                    if self._is_button(update):
                        msg = update.callback_query.message
                        text = update.callback_query.data
                    elif self._is_edited_message(update):
                        return response.text("success")
                    else:
                        msg = update.message
                        if self._is_user_message(msg):
                            text = msg.text.replace("/bot", "")
                        else:
                            return response.text("success")
                    sender_id = msg.chat.id
                    metadata = self.get_metadata(request)
                    if text in ["/login",  "/affirm", "/deny", "/session_start"] :
                        await on_new_message(
                            UserMessage(
                                text,
                                out_channel,
                                sender_id,
                                input_channel=self.name(),
                                metadata=metadata,
                            )
                        )
                    if text[0] == INTENT_MESSAGE_PREFIX:
                        logger.info(f"{__file__}::{str(sender_id)} Encounter a text starting with / ")
                        return response.text("success")
                    else:
                        await on_new_message(
                            UserMessage(
                                text,
                                out_channel,
                                sender_id,
                                input_channel=self.name(),
                                metadata=metadata,
                            )
                        )
                        logger.info(f"{__file__} : {sender_id} : {out_channel.messages}")
                        return response.json(out_channel.messages)

                except Exception as e:
                    logger.info(f"{__file__}::{str(sender_id)} Exception when trying to handle message.{e}")
                    logger.debug(e, exc_info=True)
                    # if self.debug_mode:
                    #     raise
                    pass

                return response.json({"status": "ok"})

        return tg_webhook

