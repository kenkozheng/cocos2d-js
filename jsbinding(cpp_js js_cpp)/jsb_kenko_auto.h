

#ifndef jsb_jsb_kenko_auto_h
#define jsb_jsb_kenko_auto_h

#include "cocos2d.h"

std::string os_info();
bool jsb_os_info(JSContext *cx, uint32_t argc, JS::Value *vp);
bool jsb_callback(JSContext *cx, uint32_t argc, JS::Value *vp);
void register_jsb_kenko_all(JSContext* cx, JSObject* obj);

#endif