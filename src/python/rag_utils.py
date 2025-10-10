
# import required modules
import os
import time
import docx
import olefile
import hwp5
import PyPDF2

DEBUG_MODE = True
BEGIN_TIME = time.time()

def print_elapsed_time_and_update(tag: str, begin_time: float = None):
    global BEGIN_TIME
    global DEBUG_MODE

    if begin_time is not None:
        BEGIN_TIME = begin_time
        print(f"BEGIN_TIME initialized to {BEGIN_TIME}")
        return
    assert BEGIN_TIME > 0, "BEGIN_TIME이 초기화되지 않았습니다."

    if DEBUG_MODE:
        print(f"Time for {tag}: {time.time() - BEGIN_TIME:.2f} seconds")
    BEGIN_TIME = time.time()


def read_msword_file(file_path):

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"파일을 찾을 수 없습니다: {file_path}")

    doc = docx.Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)


def read_pdf_file(file_path):

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"파일을 찾을 수 없습니다: {file_path}")

    full_text = []
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            full_text.append(page.extract_text())
    return '\n'.join(full_text)


def read_hwp_file(file_path):

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"파일을 찾을 수 없습니다: {file_path}")

    with olefile.OleFileIO(file_path) as ole:
        if not ole.exists('PrvText'):
            raise ValueError("HWP 파일에 PrvText 스트림이 없습니다.")
        stream = ole.openstream('PrvText')
        hwp = hwp5.HWP5File(stream)
        text = []
        for para in hwp.bodytext:
            text.append(para.text)
    return '\n'.join(text)


def read_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.txt':
        return read_text_file(file_path)
    elif ext == '.docx':
        return read_msword_file(file_path)
    elif ext == '.pdf':
        return read_pdf_file(file_path)
    elif ext == '.hwp':
        return read_hwp_file(file_path)
    else:
        raise ValueError(f"지원되지 않는 파일 형식입니다: {ext}")


def write_text_to_file(file_path, text):
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(text)
    #print(f"텍스트가 {file_path}에 저장되었습니다.")


# ===== 유틸: 파일 로드 & 청크 =====
def read_text(path):
    """
    읽을 파일을 열어 텍스트를 반환합니다.

    Parameters
    ----------
    path : str
        파일 경로

    Returns
    -------
    str
        읽은 텍스트

    Raises
    ------
    FileNotFoundError
        파일이 존재하지 않을 때
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"지식 파일을 찾을 수 없습니다: {path}")
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

