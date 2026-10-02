import { consola } from 'consola';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import { Client, type DatabaseObjectResponse } from '@notionhq/client';
import { type CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import scrapyDouban from './handle-douban';
import { getDataSourceId, sleep, buildPropertyValue } from './utils';
import { PropertyTypeMap, EMOJI } from './const';
import DB_PROPERTIES from '../cols.json';
import {
  ItemCategory,
  type FeedItem,
  type NotionUrlPropType,
  type DB_PROPERTIES_KEYS,
  type FailedItem,
} from './types';

// https://github.com/makenotion/notion-sdk-js/issues/280#issuecomment-1178523498
type EmojiRequest = Extract<CreatePageParameters['icon'], { type?: 'emoji'; }>['emoji'];

dotenv.config();

const notionVersion = process.env.NOTION_API_VERSION ?? '2022-06-28';
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion,
});

if (!notion?.databases || typeof notion.databases.query !== 'function') {
  throw new Error(`Notion client failed to initialize. Check NOTION_TOKEN and the SDK version (${notionVersion}).`);
}
