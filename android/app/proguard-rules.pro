# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Disabling obfuscation is useful if you collect stack traces from production crashes
# (unless you are using a system that supports de-obfuscate the stack traces).
# -dontobfuscate

# React Native

# This is a configuration file for ProGuard.
# http://proguard.sourceforge.net/index.html#manual/usage.html
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose

# If you want to enable optimization, you should include the
# following:
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification


# Keep our interfaces so they can be used by other ProGuard rules.
# See http://sourceforge.net/p/proguard/bugs/466/
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers,includedescriptorclasses class * { native <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

-dontwarn com.facebook.react.**
-keep,includedescriptorclasses class com.facebook.react.bridge.** { *; }

# okhttp

-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**

# okio

-keep class sun.misc.Unsafe { *; }
-dontwarn java.nio.file.*
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn okio.**
-dontwarn sun.misc.Unsafe

# Firebase

-keep public class com.google.firebase.* { public *; }
-dontwarn com.google.firebase.**

-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

-keep public class com.google.android.gms.ads.**{public *;}
-keep public class com.google.ads.**{ public *;}
-dontwarn com.google.android.gms.ads.**

# if using notifications from RNFirebase
-keep public class me.leolin.shortcutbadger.* { public *; }
-dontwarn me.leolin.shortcutbadger.**

-dontwarn android.text.StaticLayout

# Crash
-keep class com.crashlytics.** { *; }
-dontwarn com.crashlytics.**

# WebRTC
-keep class org.webrtc.**  { *; }
-dontwarn org.webrtc.**

# Fast image
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}

#Mapping file name, line
-printmapping mapping.txt
-renamesourcefileattribute MyApplication
-keepattributes SourceFile,LineNumberTable

# Payoo
-dontwarn com.google.**
-dontwarn vn.payoo.sdk.**
-keep class vn.payoo.sdk.** { *; }
-dontwarn vn.payoo.paymentsdk.**
-keep class vn.payoo.paymentsdk.** { *; }
-dontwarn android.graphics.ImageDecoder.**
#-keep class android.graphics.ImageDecoder.** { *; }
-keepclassmembers class rx.internal.util.unsafe.*ArrayQueue*Field* {
   long producerIndex;
   long consumerIndex;
}

-keepclassmembers class rx.internal.util.unsafe.BaseLinkedQueueProducerNodeRef {
   long producerNode;
   long consumerNode;
}
#-keep class rx.schedulers.Schedulers {
#    public static <paymentMethods>;
#}
#-keep class rx.schedulers.ImmediateScheduler {
#    public <paymentMethods>;
#}
#-keep class rx.schedulers.TestScheduler {
#    public <paymentMethods>;
#}
-keep class rx.schedulers.Schedulers {
    public static ** test();
}
#-keepclasseswithmembers class * {
#    @retrofit2.http.* <paymentMethods>;
#}

#-keepclassmembers class * {
#    @android.webkit.JavascriptInterface <paymentMethods>;
#}

-keep class com.zing.zalo.**{ *; }
-keep enum com.zing.zalo.**{ *; }
-keep interface com.zing.zalo.**{ *; }


# react-native-photo-editor
-keep class androidx.appcompat.widget.** { *; }

