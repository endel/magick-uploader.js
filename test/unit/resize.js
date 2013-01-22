test("resize", function() {
  $("input[type=file]").remove();
  $(document).append('<input type="file" name="upload" />');
  ok(true);
});
