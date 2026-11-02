// Quét tương phản theo TỪNG đoạn chữ đang hiển thị, bổ sung cho
// textContrastGuideline của Flutter (08 §1 F2). Chép cạnh test thành
// test/ui_standard/text_contrast_scan.dart; mẫu flutter_ui_standard_test.dart.tmpl dùng nó.
// Đã chạy thật: CareAI/companion_app (Flutter 3.47.5, 28/10/2026).
//
// Vì sao cần: textContrastGuideline đi theo cây ngữ nghĩa và tìm lại widget
// bằng find.text(nhãn). Khi nhiều Text bị gộp vào một nút (ví dụ logo + khẩu hiệu
// trong ListView có nhãn "CareAI\nChăm sóc gia đình"), không Text nào khớp
// nhãn gộp nên các dòng đó bị BỎ QUA mà không báo.
// Chỉ đo phần đang vẽ trong khung: dựng khung đủ cao (xem mountWhole trong mẫu).
// Chữ trên điều khiển đang vô hiệu được miễn tương phản (02, SC 1.4.3) nhưng hàm này không biết điều khiển nào
// vô hiệu: dòng LỖI thuộc nút disabled thì ghi miễn trừ trong báo cáo, không hạ ngưỡng. Hàm này đi theo mọi
// RichText (trừ glyph của Icon — là thành phần phi văn bản, ngưỡng khác), dùng
// cùng cách đo của Flutter: chụp lớp vẽ, lấy histogram điểm ảnh trong khung chữ
// nới 4px, tách theo độ sáng trung bình, lấy màu phổ biến nhất mỗi bên.

import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';

class TextContrastFinding {
  TextContrastFinding(this.text, this.fontSize, this.ratio, this.target, this.dark, this.light);
  final String text;
  final double fontSize;
  final double ratio;
  final double target;
  final Color dark;
  final Color light;

  bool get passed => ratio - target >= -0.01;

  String _hex(Color c) =>
      '#${c.toARGB32().toRadixString(16).padLeft(8, '0').substring(2).toUpperCase()}';

  @override
  String toString() => '${passed ? 'ĐẠT ' : 'LỖI '} ${ratio.toStringAsFixed(2)}:1 '
      '(cần ${target.toStringAsFixed(1)}) · ${fontSize}px · '
      'chữ ${_hex(dark)} / nền ${_hex(light)} · "${text.replaceAll('\n', r'\n')}"';
}

/// [normal]/[large]: ngưỡng chữ thường/chữ lớn (AA 4.5/3.0; AAA 7.0/4.5).
Future<List<TextContrastFinding>> scanTextContrast(
  WidgetTester tester, {
  double normal = 4.5,
  double large = 3.0,
}) async {
  final renderView = tester.binding.renderViews.first;
  final layer = renderView.debugLayer! as OffsetLayer;
  late int width;
  late int height;
  final ByteData data = (await tester.binding.runAsync<ByteData?>(() async {
    final double ratio = 1 / renderView.flutterView.devicePixelRatio;
    final ui.Image image = await layer.toImage(renderView.paintBounds, pixelRatio: ratio);
    width = image.width;
    height = image.height;
    final ByteData? bytes = await image.toByteData();
    image.dispose();
    return bytes;
  }))!;

  final iconText = find
      .descendant(of: find.byType(Icon), matching: find.byType(RichText))
      .evaluate()
      .toSet();

  final findings = <TextContrastFinding>[];
  for (final element in find.byType(RichText).evaluate()) {
    if (iconText.contains(element)) continue;
    final widget = element.widget as RichText;
    final String text = widget.text.toPlainText();
    if (text.trim().isEmpty) continue;
    final box = element.renderObject! as RenderBox;
    final Rect bounds = MatrixUtils.transformRect(
      box.getTransformTo(null),
      box.paintBounds.inflate(4.0),
    ).intersect(Rect.fromLTWH(0, 0, width.toDouble(), height.toDouble()));
    if (bounds.width <= 0 || bounds.height <= 0) continue; // ngoài khung

    final histogram = <int, int>{};
    for (var x = bounds.left.floor(); x < bounds.right.ceil(); x++) {
      for (var y = bounds.top.floor(); y < bounds.bottom.ceil(); y++) {
        final int rgba = data.getUint32((y * width + x) * 4);
        histogram.update(rgba, (c) => c + 1, ifAbsent: () => 1);
      }
    }
    final colors = histogram.map((rgba, count) => MapEntry(
        Color.fromARGB(rgba & 0xFF, (rgba >> 24) & 0xFF, (rgba >> 16) & 0xFF, (rgba >> 8) & 0xFF),
        count));

    var total = 0.0;
    var n = 0;
    colors.forEach((c, count) {
      total += HSLColor.fromColor(c).lightness * count;
      n += count;
    });
    final average = total / n;
    MapEntry<Color, int>? dark;
    MapEntry<Color, int>? light;
    for (final e in colors.entries) {
      if (HSLColor.fromColor(e.key).lightness <= average) {
        if (e.value > (dark?.value ?? 0)) dark = e;
      } else if (e.value > (light?.value ?? 0)) {
        light = e;
      }
    }
    final Color d = (dark ?? light)!.key;
    final Color l = (light ?? dark)!.key;
    final double ratio = (l.computeLuminance() + 0.05) / (d.computeLuminance() + 0.05);

    final TextStyle? style = widget.text.style;
    final double fontSize = style?.fontSize ?? 14;
    final bool bold = (style?.fontWeight?.value ?? 400) >= 700;
    // Chữ lớn theo WCAG: 18pt (24 logical px) hoặc 14pt đậm (≈ 18.66px). Chặt hơn hằng số 18px của
    // textContrastGuideline trong Flutter — chủ ý, để không hạ ngưỡng cho chữ 18–23px.
    final bool isLarge = fontSize >= 24 || (bold && fontSize >= 18.66);
    findings.add(TextContrastFinding(text, fontSize, ratio, isLarge ? large : normal, d, l));
  }
  return findings;
}
