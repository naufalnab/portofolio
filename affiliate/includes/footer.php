  </main>

  <!-- App Settings injected from PHP -->
  <script>
    window.APP_SETTINGS = <?php echo json_encode($settings, JSON_UNESCAPED_UNICODE); ?>;
  </script>
  <script src="assets/js/script.js"></script>
</body>

</html>
